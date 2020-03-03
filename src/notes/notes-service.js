const NoteService = {
    getAllNotes(knexInstance) {
        return knexInstance
            .select('*')
            .from('notes')
    },
    getById(knexInstance, id) {
        return knexInstance
            .from('notes')
            .select('*')
            .where('id', id)
            .first()
    },
    insertNote(knexInstance, newNote) {
        return knexInstance
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then( rows => {
                return rows[0]
            })
    },
    deleteNote(knexInstance, id) {
        return knexInstance('notes')
            .where({ id })
            .delete()
    },
    patchNote(knexInstance, id, newNoteFields) {
        return knexInstance('notes')
            .where({ id })
            .update(newNoteFields)
    }
}


module.exports = NoteService