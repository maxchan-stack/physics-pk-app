"""
物理大PK 領域模型定義 (Model 層)
定義 108 課綱高中三年段物理章節、題目與對戰紀錄之資料結構
"""
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ChapterModel:
    """
    108 課綱物理章節資料模型
    """
    id: str
    grade: str  # "grade10" (高一), "grade11" (高二), "grade12" (高三)
    volume_name: str  # 冊別名稱，例如「選修物理 I (力學一)」
    code: str  # 例如 "Ch1"
    title: str  # 例如 "測量與不確定度"
    bot_name: str  # 該章節對應之守關物理學家 Bot


@dataclass
class QuestionModel:
    """
    物理測驗題目資料模型
    """
    id: str
    chapter_id: str
    difficulty: int  # 1: ★基礎, 2: ★★段考, 3: ★★★大考/物奧挑戰
    stem: str  # 題幹 (支援 LaTeX)
    options: List[str]  # 四個選項內容
    correct_index: int  # 正確選項索引 (0~3)
    key_formula: str  # 破題關鍵公式
    explanation: str  # 完整推導解析
    common_mistake: str  # 常見易錯陷阱提醒
    concept_id: Optional[str] = field(default=None)  # 關聯之觀念黑板 ID
