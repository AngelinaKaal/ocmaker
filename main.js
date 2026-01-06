// --- { 1. The Main Display Function } ---
async function fetchAndDisplay() {
    const gallery = document.getElementById('character-gallery');
    
    const { data: characters, error } = await _supabase
        .from('characters')
        .select(`
            *,
            worlds ( world_name ),
            strengths ( name )
        `);

    if (error) {
        gallery.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        return;
    }

    gallery.innerHTML = ''; 

    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100 character-card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title">${char.fname}</h4>
                        <button class="btn-delete" onclick="deleteCharacter(${char.id})">X</button>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${char.frole || 'No Role'}</h6>
                    <hr>
                    <p class="card-text">
                        <strong>World:</strong> ${char.worlds?.world_name || 'N/A'}<br>
                        <strong>Race:</strong> ${char.frace || 'N/A'}
                    </p>
                    <button class="btn btn-primary btn-sm w-100">View Full Lore</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// --- { 2. The Delete Function (Put this at the bottom) } ---
window.deleteCharacter = async (id) => {
    if (confirm("Are you sure you want to delete this character? All their relationships will be deleted too.")) {
        const { error } = await _supabase
            .from('characters')
            .delete()
            .eq('id', id);
            
        if (!error) {
            alert("Character removed from the archives.");
            fetchAndDisplay(); // This reloads the list without refreshing the whole page
        } else {
            console.error(error);
            alert("Could not delete character.");
        }
    }
};

// --- { 3. Run the display on page load } ---
fetchAndDisplay();