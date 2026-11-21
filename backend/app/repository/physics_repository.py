"""
物理大PK 資料存取層 (Repository 層)
負責存取 108 課綱高中三年段章節與題庫資料
"""
from typing import Dict, List, Optional
from app.model.physics_model import ChapterModel, QuestionModel


class PhysicsRepository:
    """
    物理題庫與章節資料存取物件 (DAO)
    """

    def __init__(self) -> None:
        self._chapters: List[ChapterModel] = self._init_chapters()
        self._questions: List[QuestionModel] = self._init_questions()

    def _init_chapters(self) -> List[ChapterModel]:
        """
        初始化 108 課綱高一至高三章節列表
        """
        return [
            # 高二：選修物理 I (力學一) - 對應參考畫面並完整保留
            ChapterModel("g11-ch1", "grade11", "選修物理 I・II（力學與熱學）", "Ch1", "測量與不確定度", "法拉第 Bot"),
            ChapterModel("g11-ch2", "grade11", "選修物理 I・II（力學與熱學）", "Ch2", "直線運動", "伽利略 Bot"),
            ChapterModel("g11-ch3", "grade11", "選修物理 I・II（力學與熱學）", "Ch3", "平面運動", "惠更斯 Bot"),
            ChapterModel("g11-ch4", "grade11", "選修物理 I・II（力學與熱學）", "Ch4", "牛頓運動定律", "牛頓 Bot"),
            ChapterModel("g11-ch5", "grade11", "選修物理 I・II（力學與熱學）", "Ch5", "萬有引力定律", "克卜勒 Bot"),
            ChapterModel("g11-ch6", "grade11", "選修物理 I・II（力學與熱學）", "Ch6", "動量、功與力學能", "焦耳 Bot"),
            ChapterModel("g11-ch7", "grade11", "選修物理 I・II（力學與熱學）", "Ch7", "熱學與氣體動力論", "波茲曼 Bot"),
            # 高一：必修物理 (學測範圍)
            ChapterModel("g10-ch1", "grade10", "高一必修物理（學測核心）", "Ch1", "科學方法與物質組成", "拉塞福 Bot"),
            ChapterModel("g10-ch2", "grade10", "高一必修物理（學測核心）", "Ch2", "物體的運動與萬有引力", "牛頓 Bot"),
            ChapterModel("g10-ch3", "grade10", "高一必修物理（學測核心）", "Ch3", "電與磁的統一", "法拉第 Bot"),
            ChapterModel("g10-ch4", "grade10", "高一必修物理（學測核心）", "Ch4", "能量與量子現象", "愛因斯坦 Bot"),
            # 高三：選修物理 III~V (波動光學、電磁學、近代物理)
            ChapterModel("g12-ch1", "grade12", "選修物理 III~V（光波・電磁・近代）", "Ch1", "波動、聲波與都卜勒效應", "都卜勒 Bot"),
            ChapterModel("g12-ch2", "grade12", "選修物理 III~V（光波・電磁・近代）", "Ch2", "幾何光學與物理光學", "楊氏 Bot"),
            ChapterModel("g12-ch3", "grade12", "選修物理 III~V（光波・電磁・近代）", "Ch3", "靜電學與直流電路", "庫侖 Bot"),
            ChapterModel("g12-ch4", "grade12", "選修物理 III~V（光波・電磁・近代）", "Ch4", "電流磁效應與電磁感應", "馬克士威 Bot"),
            ChapterModel("g12-ch5", "grade12", "選修物理 III~V（光波・電磁・近代）", "Ch5", "量子現象與原子結構", "波耳 Bot"),
        ]

    def _init_questions(self) -> List[QuestionModel]:
        """
        初始化核心範例題目資料
        """
        return [
            QuestionModel(
                id="q-g11-ch1-1",
                chapter_id="g11-ch1",
                difficulty=1,
                stem="某車加速度為 $1\\text{ m/s}^2$，若改以「$\\text{km/h}$ 每秒」為單位，數值為何？",
                options=["3.6", "1", "3600", "60"],
                correct_index=0,
                key_formula="1\\text{ m/s} = 3.6\\text{ km/h}",
                explanation="加速度 $1\\text{ m/s}^2$ 代表每秒速度變化量為 $1\\text{ m/s}$。因為 $1\\text{ m/s} = \\frac{10^{-3}\\text{ km}}{\\frac{1}{3600}\\text{ h}} = 3.6\\text{ km/h}$，故每秒增加 $3.6\\text{ km/h}$。",
                common_mistake="容易誤把分母的第二個「秒」也換成小時而乘上兩次 3600，題目問的是「(km/h) / s」。",
                concept_id="c-g11-1-1",
            ),
            QuestionModel(
                id="q-g11-ch5-1",
                chapter_id="g11-ch5",
                difficulty=2,
                stem="某行星的質量與地球相同，但平均密度是地球的 8 倍。其表面重力加速度為地球的幾倍？",
                options=["2 倍", "8 倍", "4 倍", "1/4 倍"],
                correct_index=2,
                key_formula="g = \\frac{GM}{R^2}, \\quad M = \\rho \\cdot \\frac{4}{3}\\pi R^3",
                explanation="質量 $M$ 相同時，密度 $\\rho \\propto R^{-3}$。因密度為地球 8 倍，故行星半徑 $R' = \\frac{1}{2}R$。再由 $g = \\frac{GM}{R^2} \\propto R^{-2}$，可得表面重力加速度 $g' = 4g$。",
                common_mistake="誤以為半徑變 1/8 或忘記重力加速度與半徑平方成反比。",
                concept_id="c-g11-5-1",
            ),
        ]

    def get_chapters(self, grade: Optional[str] = None) -> List[ChapterModel]:
        """
        根據年段取得章節清單
        """
        if not grade or grade == "all":
            return self._chapters
        return [ch for ch in self._chapters if ch.grade == grade]

    def get_chapter_by_id(self, chapter_id: str) -> Optional[ChapterModel]:
        """
        根據章節 ID 查詢單一章節
        """
        for ch in self._chapters:
            if ch.id == chapter_id:
                return ch
        return None

    def get_questions(self, chapter_id: str, difficulty: int) -> List[QuestionModel]:
        """
        根據章節與難度篩選題目
        """
        matched = [
            q for q in self._questions
            if q.chapter_id == chapter_id and q.difficulty == difficulty
        ]
        return matched if matched else self._questions

    def get_question_map(self) -> Dict[str, QuestionModel]:
        """
        取得題目 ID 對應表以供快速批改
        """
        return {q.id: q for q in self._questions}
