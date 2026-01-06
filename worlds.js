document.getElementById('worldForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const worldData = {
        world_name: document.getElementById('world_name').value,
        world_year: parseInt(document.getElementById('world_year').value) || null,
        world_description: document.getElementById('world_description').value,
        world_locations: document.getElementById('world_locations').value,
        world_rules: document.getElementById('world_rules').value,
        world_races: document.getElementById('world_races').value
    };

    const { error } = await _supabase.from('worlds').insert([worldData]);

    if (!error) {
        alert("World Created Successfully!");
        document.getElementById('worldForm').reset();
    } else {
        console.error(error);
        alert("Error creating world.");
    }
});