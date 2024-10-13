document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';

    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong>
                            <p>${data.documents[i]}</p>
                            <br>
                            <strong>Similarity:</strong> ${data.similarities[i].toFixed(4)}`;

        resultsDiv.appendChild(docDiv);
    }
}

function displayChart(data) {
    const ctx = document.getElementById('similarity-chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.indices,
            datasets: [{
                label: 'Cosine Similarity',
                data: data.similarities,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cosine Similarity of Top Documents'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Similarity: ${context.raw.toFixed(4)}`;
                        }
                    }
                }
            }
        }
    });
}