import axios from "axios";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get('https://valorant-api.com/v1/weapons');
    const weapons = response.data.data;

    weapons.forEach((weapon: any) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${weapon.displayName}</strong><br>
        <img src="${weapon.displayIcon}" width="100"><br>
        <span>Category: ${weapon.category}</span><br><br>

      `;
      document.querySelector('#weapon-list')?.appendChild(li);
    });
  } catch (error) {
    console.error('Hiba történt a Valorant API hívás során:', error);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await axios.get('https://valorant-api.com/v1/agents');
      const agents = response.data.data;
  
      agents.forEach((agent: any) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${agent.displayName}</strong><br>
          <img src="${agent.displayIcon}" width="100"><br>
          <span>Category: ${agent.description}</span><br><br>
                    <img src="${agent.background}" width="100"><br>

        `;
        document.querySelector('#agent-list')?.appendChild(li);
      });
    } catch (error) {
      console.error('Hiba történt a Valorant API hívás során:', error);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await axios.get('https://valorant-api.com/v1/maps');
      const maps = response.data.data;
  
      maps.forEach((map: any) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${map.displayName}</strong><br>
          <img src="${map.displayIcon}" width="100"><br>
          <img src="${map.splash}" width="100"><br>
          <img src="${map.stylizedBackgroundImage}" width="300"><br>

        `;
        document.querySelector('#map-list')?.appendChild(li);
      });
    } catch (error) {
      console.error('Hiba történt a Valorant API hívás során:', error);
    }
  });