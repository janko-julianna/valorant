document.addEventListener("DOMContentLoaded", () => {
  loadMaps();
});

const mapTypeByName: Record<string, string> = {
  "Ascent": "competitive",
  "Bind": "competitive",
  "Haven": "competitive",
  "Fracture": "competitive",
  "Breeze": "competitive",
  "Pearl": "competitive",
  "Split": "competitive",
  "Sunset": "competitive",
  "The Range": "deathmatch",
  "District": "deathmatch",
  "Kasbah": "escalation"
};

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

const loadMapDetails = async (params: { uuid: string }): Promise<void> => {
  const other = document.querySelectorAll(':not(#map-details-' + params.uuid + ')') as NodeListOf<HTMLDivElement>;
  other.forEach((el) => {
    if (el.id.startsWith('map-details-')) {
      el.innerHTML = '';
    }
  });

  const detailsDiv = document.querySelector('#map-details-' + params.uuid) as HTMLDivElement;
  if (!detailsDiv) return;

  try {
    const response = await axios.get('https://valorant-api.com/v1/maps');
    const maps = response.data.data;
    const map = maps.find((m: any) => m.uuid === params.uuid);
    if (!map) {
      detailsDiv.innerHTML = '<p>Nem található ilyen térkép.</p>';
      return;
    }
    detailsDiv.innerHTML = `
      <h2>${map.displayName}</h2>
      <img src="${map.displayIcon}" alt="${map.displayName}" class="img-fluid mb-3">
      <p><strong>Koordináták:</strong> ${map.coordinates || 'N/A'}</p>
      <p><strong>Siteok:</strong> ${map.tacticalDescription || 'N/A'}</p>
      <h4>Calloutok:</h4>
      <ul>
        ${map.callouts ? map.callouts.slice(0,5).map((callout: any) => `<li>${callout.regionName} (${callout.superRegionName})</li>`).join('') : '<li>Nincs adat</li>'}
      </ul>
    `;
  } catch (error) {
    detailsDiv.innerHTML = '<p>Hiba történt a térkép lekérésekor.</p>';
  }
};

const filterMaps = (maps: any[], selectedType: string) => {
  return maps.filter(map => {
    const mapType = mapTypeByName[map.displayName] || '';
    return !selectedType || mapType === selectedType;
  });
};

const loadMaps = async (): Promise<void> => {
  await fetchWithErrorHandling(
    'https://valorant-api.com/v1/maps',
    (maps) => {
      const dropdown = document.getElementById('map-type-filter') as HTMLSelectElement;
      
      const applyFilter = () => {
        const selectedType = dropdown.value;
        const filteredMaps = filterMaps(maps, selectedType).filter((map: any) => map.displayIcon);

        const mapList = document.querySelector('#map-list') as HTMLDivElement;
        if (!mapList) return;

        mapList.innerHTML = `
          <div class="container">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              ${filteredMaps
                .map(
                  (map: any) => `
                  <div class="col">
                    <div class="card h-100 map-card" data-uuid="${map.uuid}" style="cursor:pointer;">
                      <img src="${map.splash}" class="card-img-top" alt="${map.displayName}" style="object-fit: cover; height: 200px;">
                      <div class="card-body">
                        <h5 class="card-title">${map.displayName}</h5>
                        ${map.coordinates ? `<p class="card-text"><small>Coordinates: ${map.coordinates}</small></p>` : ''}
                      </div>
                      <div class="map-details" id="map-details-${map.uuid}"></div>
                    </div>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>
        `;

        mapList.querySelectorAll('.map-card').forEach((card) => {
          card.addEventListener('click', (event) => {
            const uuid = (event.currentTarget as HTMLElement).getAttribute('data-uuid');
            loadMapDetails({ uuid: uuid || '' });
          });
        });
      };

      applyFilter();
      dropdown?.addEventListener('change', applyFilter);
    }
  );
};
