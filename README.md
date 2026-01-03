# BOLTDOC - File Search & Report Generator

A modern web-based tool for searching strings in files and generating comprehensive reports.

## Features

- 🔍 **File Search**: Search for specific strings across multiple files in a directory
- 📊 **Report Generation**: Create detailed HTML reports with search results
- 🎨 **Modern UI**: Responsive, user-friendly web interface
- ⚡ **Fast & Efficient**: Quick scanning and result display
- 📱 **Mobile Friendly**: Works seamlessly on all devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/GonLAV/BOLTDOC.git
cd BOLTDOC
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Web Interface (Recommended)

1. Start the Flask web server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Use the web interface to:
   - Enter the folder path containing files to search
   - Specify search strings (comma-separated)
   - Click "Search Files" to view results
   - Click "Generate Report" to create an HTML report

### Command Line Interface

You can still use the original CLI:

```bash
cd main
python main.py
```

Follow the prompts to enter search strings and folder path.

## Project Structure

```
BOLTDOC/
├── app.py                 # Flask web application
├── requirements.txt       # Python dependencies
├── main/
│   ├── main.py           # CLI entry point
│   ├── file_search.py    # File search logic
│   └── report_generator.py # Report generation
├── templates/
│   └── index.html        # Web UI template
└── static/
    ├── css/
    │   └── style.css     # Styling
    └── js/
        └── app.js        # Frontend JavaScript
```

## Requirements

- Python 3.7+
- Flask 3.0.0
- Werkzeug 3.0.1

## License

Open source project for file searching and reporting.
