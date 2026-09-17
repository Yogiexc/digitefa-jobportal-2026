import sys
import json
from unittest.mock import MagicMock

# Mock heavy modules before importing main
sys.modules['sentence_transformers'] = MagicMock()
sys.modules['pdfplumber'] = MagicMock()
sys.modules['wordcloud'] = MagicMock()
sys.modules['matplotlib'] = MagicMock()
sys.modules['matplotlib.pyplot'] = MagicMock()
sys.modules['pandas'] = MagicMock()

try:
    from fastapi.openapi.utils import get_openapi
    from main import app

    with open("openapi_ai.json", "w") as f:
        json.dump(
            get_openapi(
                title=app.title,
                version=app.version,
                openapi_version=app.openapi_version,
                description=app.description,
                routes=app.routes,
            ),
            f, indent=2
        )
    print("Saved openapi_ai.json")
except Exception as e:
    print("Failed: " + str(e))
