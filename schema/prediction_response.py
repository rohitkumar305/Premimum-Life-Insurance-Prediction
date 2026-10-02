from typing import Literal
from pydantic import BaseModel, Field

class PredictionResponse(BaseModel):
    premium_category: Literal['High', 'Medium', 'Low'] = Field(
        ...,
        description="The predicted insurance premium category",
        examples=["High"],
    )

