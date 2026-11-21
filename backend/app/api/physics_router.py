"""
物理大PK API 路由層 (API 層)
僅負責請求解析 (Request Parsing) 與回應封裝 (Response)，嚴禁直接操作資料庫
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.repository.physics_repository import PhysicsRepository
from app.schema.physics_schema import (
    ChapterResponse,
    MatchEvaluationResponse,
    MatchSubmitRequest,
    QuestionResponse,
)
from app.service.physics_service import PhysicsService

router = APIRouter(prefix="/api/v1/physics", tags=["physics-pk"])

_repository_instance = PhysicsRepository()
_service_instance = PhysicsService(_repository_instance)


def get_physics_service() -> PhysicsService:
    """
    取得 PhysicsService 依賴注入實例
    """
    return _service_instance


@router.get("/chapters", response_model=List[ChapterResponse])
def get_chapters(
    grade: Optional[str] = Query(None, description="篩選年段: grade10, grade11, grade12"),
    service: PhysicsService = Depends(get_physics_service),
) -> List[ChapterResponse]:
    """
    取得 108 課綱高中物理各年段章節清單
    """
    chapters = service.list_chapters(grade=grade)
    return [ChapterResponse(**ch.__dict__) for ch in chapters]


@router.get("/questions", response_model=List[QuestionResponse])
def get_questions(
    chapter_id: str = Query(..., description="章節 ID"),
    difficulty: int = Query(1, ge=1, le=3, description="難度星級 1~3"),
    service: PhysicsService = Depends(get_physics_service),
) -> List[QuestionResponse]:
    """
    根據章節與難度取得測驗題目列表
    """
    questions = service.list_questions(chapter_id=chapter_id, difficulty=difficulty)
    return [QuestionResponse(**q.__dict__) for q in questions]


@router.post("/matches/evaluate", response_model=MatchEvaluationResponse)
def evaluate_match(
    payload: MatchSubmitRequest,
    service: PhysicsService = Depends(get_physics_service),
) -> MatchEvaluationResponse:
    """
    提交對戰或單人計時作答紀錄並回傳積分批改結果
    """
    return service.evaluate_match(payload=payload)
