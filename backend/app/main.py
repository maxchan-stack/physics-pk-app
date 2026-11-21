"""
物理大PK 後端服務入口 (FastAPI Main Application)
設定日誌模組、CORS 安全政策與 API 路由掛載
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.physics_router import router as physics_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="物理大PK - 108課綱高中三年段物理複習測驗 API",
    version="2.0.0",
    description="提供高一必修、高二選修、高三選修物理對戰題庫、觀念黑板與弱點分析服務",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(physics_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    """
    服務健康檢查端點
    """
    logger.debug("Health check called")
    return {"status": "ok", "service": "physics-pk-backend"}
