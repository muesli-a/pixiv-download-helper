from typing import List

from pydantic import BaseModel, Field


class IllustInfo(BaseModel):
    """
    Represents the information about an illustration received from the frontend.
    """

    illust_id: str
    user_id: str = ""
    user_name: str = ""
    title: str = ""
    description: str = ""
    tags: List[str] = Field(default_factory=list)
    image_urls: List[str]
