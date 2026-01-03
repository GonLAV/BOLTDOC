from flask import Flask, render_template, request, jsonify, send_file
import os
import sys
from datetime import datetime

# Add the main directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'main'))

from file_search import scan_folder
from report_generator import generate_html_report

app = Flask(__name__)

# Configure upload folder for temporary files
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    """Handle search requests"""
    try:
        data = request.get_json()
        search_strings = [s.strip() for s in data.get('search_strings', '').split(',') if s.strip()]
        folder_path = data.get('folder_path', '').strip()
        
        # Validate inputs
        if not search_strings:
            return jsonify({'error': 'Please provide at least one search string'}), 400
        
        if not folder_path:
            return jsonify({'error': 'Please provide a folder path'}), 400
        
        if not os.path.exists(folder_path):
            return jsonify({'error': f'Folder path does not exist: {folder_path}'}), 400
        
        # Perform the search
        results = scan_folder(folder_path, search_strings)
        
        # Sort results by count (descending)
        results_sorted = sorted(results, key=lambda x: x[2], reverse=True)
        
        # Convert to JSON-friendly format
        results_json = [
            {
                'file_name': file_name,
                'string': string,
                'count': count
            }
            for file_name, string, count in results_sorted
        ]
        
        return jsonify({
            'success': True,
            'results': results_json,
            'total_matches': len(results_json),
            'folder_path': folder_path,
            'search_strings': search_strings
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-report', methods=['POST'])
def generate_report():
    """Generate and download HTML report"""
    try:
        data = request.get_json()
        search_strings = [s.strip() for s in data.get('search_strings', '').split(',') if s.strip()]
        folder_path = data.get('folder_path', '').strip()
        
        # Validate inputs
        if not search_strings or not folder_path:
            return jsonify({'error': 'Missing required parameters'}), 400
        
        if not os.path.exists(folder_path):
            return jsonify({'error': f'Folder path does not exist: {folder_path}'}), 400
        
        # Perform the search and generate report
        results = scan_folder(folder_path, search_strings)
        
        # Generate report with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_filename = f'report_{timestamp}.html'
        
        # Generate the report
        generate_html_report(results, folder_path)
        
        # Rename to timestamped filename
        if os.path.exists('report.html'):
            os.rename('report.html', report_filename)
        
        return jsonify({
            'success': True,
            'message': 'Report generated successfully',
            'filename': report_filename
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
