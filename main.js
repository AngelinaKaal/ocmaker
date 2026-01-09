// --- { 1. The Main Display Function } ---
async function fetchAndDisplay() {
    console.log("Attempting to fetch characters...");
    const gallery = document.getElementById('character-gallery');
    
    // Simplifed select to prevent 'Loading Forever' bugs
    const { data: characters, error } = await _supabase
        .from('characters')
        .select('*');

    if (error) {
        console.error("Supabase Error:", error);
        gallery.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        return;
    }

    console.log("Characters found:", characters);

    if (!characters || characters.length === 0) {
        gallery.innerHTML = `<h3>No characters found in the database.</h3>`;
        return;
    }

    gallery.innerHTML = ''; 

    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = "col-md-4 mb-4";
        // Using your CSS classes: character-card
        card.innerHTML = `
            <div class="card h-100 character-card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h4 class="card-title mb-0">${char.fname}</h4>
                        <button class="btn-delete" onclick="deleteCharacter(${char.id})">X</button>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${char.frole || 'No Role'}</h6>
                    <hr>
                    <p class="card-text">
                        <strong>Race:</strong> ${char.frace || 'N/A'}<br>
                        <strong>Pronouns:</strong> ${char.fpronouns || 'N/A'}
                    </p>
                    <button class="btn btn-primary btn-sm w-100">View Full Lore</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// --- { 2. The Delete Function } ---
window.deleteCharacter = async (id) => {
    if (confirm("Are you sure you want to delete this character?")) {
        const { error } = await _supabase
            .from('characters')
            .delete()
            .eq('id', id);
            
        if (!error) {
            fetchAndDisplay(); 
        } else {
            alert("Could not delete character: " + error.message);
        }
    }
};

// Run on load
fetchAndDisplay();