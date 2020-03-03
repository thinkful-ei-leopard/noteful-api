const FoldersService = {
    getAllFolders(knexInstance) {
        return knexInstance
            .select('*')
            .from('folders')
    },
    getById(knexInstance, id) {
        return knexInstance
            .from('folders')
            .select('*')
            .where('id', id)
            .first()
    },
    insertFolder(knexInstance, newFolder) {
        return knexInstance
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteFolder(knex, id) {
        return knex('folders')
            .where({ id })
            .delete()
    },
    updateFolder(knex, id, newFolderFields) {
        return knex('folders')
            .where({ id })
            .update(newFolderFields)
    }
}


module.exports = FoldersService