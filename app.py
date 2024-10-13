from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)

# Fetch dataset
newsgroups_data = fetch_20newsgroups(subset='all')['data']

# Preprocess and Vectorize Data
stop_words = stopwords.words('english')
vectorizer = TfidfVectorizer(stop_words=stop_words)
doc_term_matrix = vectorizer.fit_transform(newsgroups_data)

# Apply LSA
lsa = TruncatedSVD(n_components=100)
lsa_matrix = lsa.fit_transform(doc_term_matrix)


def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    query_vec = vectorizer.transform([query])
    query_lsa = lsa.transform(query_vec)
    cosine_similarities = cosine_similarity(query_lsa, lsa_matrix).flatten()
    top_indices = cosine_similarities.argsort()[-5:][::-1]
    top_documents = [newsgroups_data[idx] for idx in top_indices]
    top_similarities = cosine_similarities[top_indices]
    return top_documents, top_similarities.tolist(), top_indices.tolist()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    documents, similarities, indices = search_engine(query)
    return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices})


if __name__ == '__main__':
    app.run(debug=True)
