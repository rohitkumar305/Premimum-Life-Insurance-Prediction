from pathlib import Path
import pickle
import pandas as pd

# Compatibility patch for unpickling models saved with scikit-learn 1.6 on newer scikit-learn versions
try:
    import sklearn.compose._column_transformer
    if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
        class _RemainderColsList(list):
            pass
        sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList
except ImportError:
    pass

# Load the ML model using a path relative to this file
MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


def predict_output(user_input: dict) -> str:
    input_df = pd.DataFrame([user_input])
    output = model.predict(input_df)[0]
    return str(output)