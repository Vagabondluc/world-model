# Deployment Guide: Google Cloud Run

This guide provides step-by-step instructions for deploying the Mappa Imperium frontend and (optional) backend services to Google Cloud Run.

## 1. Prerequisites

1.  **Google Cloud Project**: You must have a Google Cloud project with billing enabled.
2.  **`gcloud` CLI**: Install and authenticate the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
3.  **Docker**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your local machine.
4.  **Enable APIs**: In your Google Cloud project, ensure the "Cloud Build" and "Cloud Run" APIs are enabled.

## 2. Backend Deployment (Optional)

If you are using the optional backend for persistent storage, deploy it first.

1.  **Navigate to the Backend Directory**:
    ```bash
    cd mappa-imperium/backend
    ```

2.  **Deploy to Cloud Run**: Run the following command, replacing `[YOUR-PROJECT-ID]` with your Google Cloud project ID and `[REGION]` with your preferred region (e.g., `us-central1`).
    ```bash
    gcloud run deploy mappa-backend \
      --source . \
      --platform managed \
      --region [REGION] \
      --allow-unauthenticated \
      --project [YOUR-PROJECT-ID]
    ```
    -   `--source .`: Tells Cloud Run to build the Docker image from the current directory.
    -   `--allow-unauthenticated`: Makes the backend publicly accessible so the frontend can call it. You would add authentication in a real production app.

3.  **Note the Service URL**: After deployment is complete, the `gcloud` command will output a "Service URL". Copy this URL. It will look something like `https://mappa-backend-xxxxxxxx-uc.a.run.app`.

## 3. Frontend Deployment

1.  **Configure Backend URL**:
    -   Open `mappa-imperium/frontend/index.html`.
    -   Find the `window.BACKEND_CONFIG` object.
    -   Update `HAS_BACKEND` to `true` and `API_BASE` to the Service URL you copied from the backend deployment.
    ```javascript
    window.BACKEND_CONFIG = {
      // ...
      HAS_BACKEND: true,
      API_BASE: 'https://mappa-backend-xxxxxxxx-uc.a.run.app', // Paste your URL here
      // ...
    };
    ```

2.  **Navigate to the Frontend Directory**:
    ```bash
    cd mappa-imperium/frontend
    ```
    *(Note: This assumes your AI Studio code has been moved to a `frontend/` directory in your repository).*

3.  **Deploy to Cloud Run**: Run the following command, replacing placeholders as before.
    ```bash
    gcloud run deploy mappa-frontend \
      --source . \
      --platform managed \
      --region [REGION] \
      --allow-unauthenticated \
      --project [YOUR-PROJECT-ID]
    ```

4.  **Configure Environment Variables**: The frontend needs the Gemini `API_KEY`.
    -   Go to the Google Cloud Console and navigate to your `mappa-frontend` Cloud Run service.
    -   Click "Edit & Deploy New Revision".
    -   Under the "Variables & Secrets" tab, click "Add Variable".
    -   Set the **Name** to `API_KEY`.
    -   Set the **Value** to your Gemini API key.
    -   Click "Deploy".

Your Mappa Imperium application is now live! Access it using the Service URL provided after the frontend deployment is complete.
