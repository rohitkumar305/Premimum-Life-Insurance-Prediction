from pydantic import BaseModel, Field, computed_field, field_validator
from pydantic.config import ConfigDict
from typing import Literal, Annotated
from config.cities import tier_1_cities,tier_2_cities

class UserInput(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "age": 69,
                    "weight": 119,
                    "height": 1.56,
                    "income_lpa": 2.52,
                    "smoker": False,
                    "city": "Jaipur",
                    "occupation": "retired",
                }
            ]
        }
    )

    age: Annotated[int, Field(..., gt=0, le=120, description='Age of the user (in years)')]
    weight: Annotated[float, Field(..., gt=10, lt=350, description='Weight of the user in kg')]
    height: Annotated[float, Field(..., gt=0.5, lt=2.5, description='Height of the user in meters (e.g. 1.75)')]
    income_lpa: Annotated[float, Field(..., ge=0.0, description='Annual salary of the user in LPA')]
    smoker: Annotated[bool, Field(..., description='Is user a smoker')]
    city: Annotated[str, Field(..., min_length=1, description='The city that the user belongs to')]
    occupation: Annotated[Literal['retired', 'freelancer', 'student', 'government_job',
       'business_owner', 'unemployed', 'private_job'], Field(..., description='Occupation of the user')]
    
    @field_validator("city")
    @classmethod
    def normalize_city(cls, v: str) -> str:
        cleaned = v.strip().title()
        if not cleaned:
            raise ValueError("City name cannot be empty or whitespace only")
        
        # Common city name aliases mapped to dataset standard
        city_aliases = {
            "Bengaluru": "Bangalore",
            "New Delhi": "Delhi",
            "Gurugram": "Gurgaon",
            "Prayagraj": "Allahabad",
        }
        return city_aliases.get(cleaned, cleaned)
    
    @computed_field
    @property
    def bmi(self) -> float:
        return self.weight / (self.height ** 2)
    
    @computed_field
    @property
    def lifestyle_risk(self) -> str:
        if self.smoker and self.bmi > 30:
            return "high"
        elif self.smoker or self.bmi > 27:
            return "medium"
        else:
            return "low"
        
    @computed_field
    @property
    def age_group(self) -> str:
        if self.age < 25:
            return "young"
        elif self.age < 45:
            return "adult"
        elif self.age < 60:
            return "middle_aged"
        return "senior"
    
    @computed_field
    @property
    def city_tier(self) -> int:
        if self.city in tier_1_cities:
            return 1
        elif self.city in tier_2_cities:
            return 2
        else:
            return 3
