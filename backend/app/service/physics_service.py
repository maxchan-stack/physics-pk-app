"""
物理大PK 商務邏輯層 (Service 層)
處理對戰積分計算、物理學家 Bot 模擬強度與權限驗證
"""
import logging
import os
from typing import List, Optional
from app.model.physics_model import ChapterModel, QuestionModel
from app.repository.physics_repository import PhysicsRepository
from app.schema.physics_schema import (
    MatchEvaluationResponse,
    MatchSubmitRequest,
)

logger = logging.getLogger(__name__)
SECRET_KEY = os.getenv("SECRET_KEY", "default-dev-secret-key")


class PhysicsService:
    """
    物理測驗與對戰核心商務邏輯服務
    """

    def __init__(self, repository: PhysicsRepository) -> None:
        self._repo = repository

    def list_chapters(self, grade: Optional[str] = None) -> List[ChapterModel]:
        """
        取得指定年段之所有章節
        """
        logger.info("Fetching chapters for grade: %s", grade or "all")
        return self._repo.get_chapters(grade)

    def list_questions(self, chapter_id: str, difficulty: int) -> List[QuestionModel]:
        """
        取得指定章節與難度之測驗題目
        """
        logger.info("Fetching questions for chapter=%s, difficulty=%d", chapter_id, difficulty)
        return self._repo.get_questions(chapter_id, difficulty)

    def evaluate_match(self, payload: MatchSubmitRequest) -> MatchEvaluationResponse:
        """
        計算玩家對戰得分與 Bot 表現
        採用「基礎分 100 分 + 剩餘秒數加成」計分公式，貼合《物理大PK》速度加成機制
        """
        # NOTE: 確保暱稱經過清理與驗證，不記錄敏感個資於日誌中
        clean_nickname = payload.player_nickname.strip()[:24]
        question_map = self._repo.get_question_map()
        chapter = self._repo.get_chapter_by_id(payload.chapter_id)
        bot_name = chapter.bot_name if chapter else "法拉第 Bot"

        player_score = 0
        correct_count = 0
        max_time_per_question = 50.0

        for ans in payload.answers:
            question = question_map.get(ans.question_id)
            if question and ans.selected_index == question.correct_index:
                correct_count += 1
                remaining = max(0.0, max_time_per_question - ans.time_spent_sec)
                # 每題基礎 100 分，剩餘時間每秒加 1.2 分
                speed_bonus = int(round(remaining * 1.2))
                player_score += 100 + speed_bonus

        total_questions = max(1, len(payload.answers))
        # 根據難度決定 Bot 的模擬答對題數與分數
        bot_accuracy_map = {1: 0.4, 2: 0.6, 3: 0.75}
        bot_rate = bot_accuracy_map.get(payload.difficulty, 0.5)
        bot_correct_count = int(round(total_questions * bot_rate))
        bot_score = bot_correct_count * 123

        is_victory = player_score >= bot_score
        logger.info(
            "Evaluated match mode=%s, correct=%d/%d, score=%d, victory=%s",
            payload.mode,
            correct_count,
            total_questions,
            player_score,
            is_victory,
        )

        return MatchEvaluationResponse(
            player_nickname=clean_nickname,
            player_score=player_score,
            correct_count=correct_count,
            total_questions=total_questions,
            bot_name=bot_name,
            bot_score=bot_score,
            bot_correct_count=bot_correct_count,
            is_victory=is_victory,
        )
