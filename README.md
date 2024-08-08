# Chromadb WebUI

This project aims to provide a graphical user interface (GUI) for managing and adjusting Chromadb.

## Usage

To get started, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/treeleaves30760/chromadb-WebUI.git
    ```

2. Navigate to the project directory:

    ```bash
    cd chromadb-WebUI
    ```

3. Set up and run the Python server:

    ```bash
    cd backend
    conda create -n chromadb_management python==3.11.9 -y
    conda activate chromadb_management
    pip install -r requirements.txt
    python main.py
    ```

4. Set up and run the frontend:

    ```bash
    cd frontend-react
    npm install
    npm run dev
    ```

Once the server and frontend are running, you can access the Chromadb WebUI by opening your browser and navigating to `http://localhost:3000`.

Please note that you may need to configure the server and frontend settings according to your specific environment.
