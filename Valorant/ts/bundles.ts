let allBundles: any[] = [];

document.addEventListener("DOMContentLoaded", () => {
  loadBundles();

  const searchBar = document.querySelector("#search-bar") as HTMLInputElement;
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const query = searchBar.value.toLowerCase();
      const filtered = allBundles.filter(bundle =>
        bundle.displayName.toLowerCase().includes(query)
      );
      SearchBundles(filtered);
    });
  }
});

const fetchWithErrorHandling = async (
  url: string,
  parseCallback: (data: any) => void
): Promise<void> => {
  try {
    const response = await axios.get(url);
    parseCallback(response.data.data);
  } catch (error) {
    console.error(`Hiba történt a ${url} API-hívás során:`, error);
  }
};

const loadBundles = async (): Promise<void> => {
  await fetchWithErrorHandling(
    'https://valorant-api.com/v1/bundles',
    (bundles) => {
      allBundles = bundles.filter((bundle: any) => bundle.displayIcon);
      SearchBundles(allBundles);
    }
  );
};

const SearchBundles = (bundles: any[]): void => {
  const mapList = document.querySelector('#bundles-list') as HTMLDivElement;
  if (!mapList) return;

  if (bundles.length === 0) {
    mapList.innerHTML = `<p class="text-center mt-4">Nincs találat.</p>`;
    return;
  }

  mapList.innerHTML = `
    <div class="container">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        ${bundles.map(
          (bundle: any) => `
            <div class="col">
              <div class="card h-100 bundles-card" data-uuid="${bundle.uuid}" style="cursor:pointer;">
                <img src="${bundle.displayIcon}" class="card-img-top" alt="${bundle.displayName}" style="object-fit: cover; height: 200px;">
                <div class="card-body">
                  <h5 class="card-title">${bundle.displayName}</h5>
                </div>
              </div>
            </div>
          `
        ).join('')}
      </div>
    </div>
  `;

  mapList.querySelectorAll('.bundles-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      const uuid = (event.currentTarget as HTMLElement).getAttribute('data-uuid');
      loadMapDetails({ uuid: uuid || '' });
    });
  });
};
