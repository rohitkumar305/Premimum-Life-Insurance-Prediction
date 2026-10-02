from fastapi import FastAPI, HTTPException
from schema.user_input import UserInput
from schema.prediction_response import PredictionResponse
from model.predict import predict_output

app = FastAPI(
    title="Insurance Premium Prediction API",
    version="1.0.0",
    description="API for predicting insurance premium categories based on user profile."
)

@app.get('/')
def home():
    return {'message': 'Insurance Premium Prediction API'}

@app.post('/predict', response_model=PredictionResponse)
def predict_premium(data: UserInput):
    user_input = {
        'bmi': data.bmi,
        'age_group': data.age_group,
        'lifestyle_risk': data.lifestyle_risk,
        'city_tier': data.city_tier,
        'income_lpa': data.income_lpa,
        'occupation': data.occupation
    }

    try:
        prediction = predict_output(user_input)
        return PredictionResponse(premium_category=prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)

