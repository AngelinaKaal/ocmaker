let selectedRelationships = [];

// --- { Initialize } ---
async function init() {
    await loadDropdowns();
    await loadExistingCharacters();
}

// --- { Load Worlds, Strengths, Weaknesses } ---
async function loadDropdowns() {
    const { data: worlds } = await _supabase.from('worlds').select('id, world_name');
    const { data: strengths } = await _supabase.from('strengths').select('id, name');
    const { data: weaknesses } = await _supabase.from('weaknesses').select('id, name');

    fillSelect('world_id', worlds, 'world_name');
    fillSelect('strength_id', strengths, 'name');
    fillSelect('weakness_id', weaknesses, 'name');
}

function fillSelect(id, data, label) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<option value="">Select...</option>`;
    data?.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = item[label];
        el.appendChild(opt);
    });
}

// --- { Relationship Logic } ---
async function loadExistingCharacters() {
    const { data } = await _supabase.from('characters').select('id, fname');
    fillSelect('rel_char_select', data, 'fname');
}

document.getElementById('add_rel_btn').addEventListener('click', () => {
    const select = document.getElementById('rel_char_select');
    const charId = select.value;
    const charName = select.options[select.selectedIndex].text;
    if (!charId) return;
    
    selectedRelationships.push({ related_id: charId, name: charName, type: 'Friend' });
    renderRelationships();
});

function renderRelationships() {
    const list = document.getElementById('relationship_list');
    list.innerHTML = '';
    selectedRelationships.forEach((rel, index) => {
        const div = document.createElement('div');
        div.className = "d-flex align-items-center gap-2 mb-2";
        div.innerHTML = `
            <button type="button" class="btn btn-danger btn-sm" onclick="removeRel(${index})">X</button>
            <span><strong>${rel.name}</strong></span>
            <select class="form-select form-select-sm" onchange="updateRelType(${index}, this.value)">
                <option value="Friend">Friend</option>
                <option value="Enemy">Enemy</option>
                <option value="Lover">Lover</option>
                <option value="Family">Family</option>
            </select>`;
        list.appendChild(div);
    });
}

window.removeRel = (i) => { selectedRelationships.splice(i, 1); renderRelationships(); };
window.updateRelType = (i, val) => { selectedRelationships[i].type = val; };

// --- { Final Save } ---
document.getElementById('characterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const charData = {
        fname: document.getElementById('fname').value,
        fage: parseInt(document.getElementById('fage').value) || null,
        fdob: document.getElementById('fdob').value || null,
        fgender: document.querySelector('input[name="Gender"]:checked')?.value || 'Other',
        fpronouns: document.getElementById('fpronouns').value,
        frace: document.getElementById('frace').value,
        world_id: document.getElementById('world_id').value || null,
        strength_id: document.getElementById('strength_id').value || null,
        weakness_id: document.getElementById('weakness_id').value || null,
        fabilities: document.getElementById('fabilities').value,
        fappearance: document.getElementById('fappearance').value,
        fdescription: document.getElementById('fdescription').value,
        fgoal: document.getElementById('fgoal').value,
        fflaws: document.getElementById('fflaws').value,
        frole: document.getElementById('frole').value,
        fmoral_alignment: document.getElementById('fmoral_alignment').value,
        fdeath: document.getElementById('fdeath').value
    };

    const { data, error } = await _supabase.from('characters').insert([charData]).select();

    if (data && selectedRelationships.length > 0) {
        const rels = selectedRelationships.map(r => ({
            character_id: data[0].id,
            realated_character_id: r.related_id, // Note: your schema typo "realated"
            relation_type: r.type
        }));
        await _supabase.from('relationships').insert(rels);
    }
    if (!error) { alert("Character Saved!"); location.reload(); }
});

init();