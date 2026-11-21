"""
物理大PK 請求與回應資料驗證 (Schema 層)
使用 Pydantic 進行強型別校驗，確保輸入輸出安全性
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class ChapterResponse(BaseModel):
    """
    章節資訊回應格式
    """
    id: str
    grade: str
    volume_name: str
    code: str
    title: str
    bot_name: str


class QuestionResponse(BaseModel):
    """
    題目資訊回應格式
    """
    id: str
    chapter_id: str
    difficulty: int = Field(..., ge=1, le=3, description="難度星級 1~3")
    stem: str
    options: List[str]
    correct_index: int = Field(..., ge=0, le=3)
    key_formula: str
    explanation: str
    common_mistake: str
    concept_id: Optional[str] = None


class AnswerRecordItem(BaseModel):
    """
    單題作答紀錄請求項目
    """
    question_id: str = Field(..., min_length=1, max_length=64)
    selected_index: Optional[int] = Field(None, ge=0, le=3)
    time_spent_sec: float = Field(..., ge=0.0, le=120.0)


class MatchSubmitRequest(BaseModel):
    """
    對戰或練習交卷請求格式
    """
    player_nickname: str = Field(..., min_length=1, max_length=24, description="玩家暱稱")
    mode: str = Field(..., pattern="^(bot_pk|solo_timer|room_pk)$", description="測驗模式")
    chapter_id: str = Field(..., min_length=1, max_length=64)
    difficulty: int = Field(..., ge=1, le=3)
    answers: List[AnswerRecordItem]


class MatchEvaluationResponse(BaseModel):
    """
    對戰批改與積分計算回應格式
    """
    player_nickname: str
    player_score: int
    correct_count: int
    total_questions: int
    bot_name: str
    bot_score: int
    bot_correct_count: int
    is_victory: bool
