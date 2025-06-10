document.querySelectorAll('aside li').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default action of anchor tag

    document.querySelectorAll('aside li').forEach(li => li.classList.remove('active'));
    item.classList.add('active');

    const page = item.getAttribute('data-page');
    if (page) {
      fetch(`${page}.html`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load ${page}.html`);
          return res.text();
        })
        .then(html => {
          console.log("Loaded content:", html); // Debugging
          document.getElementById('content').innerHTML = html;
        })
        .catch(error => console.error("Error loading page:", error));
    }
  });
});