function updateStats(guild, channel){

    //Vérification de l'existence du channel
    if(!channel){
        return;
    }

    //Récupération des messages du channel
    channel.messages.fetch({ limit: 1 }).then( messages => {
        //Vérification de l'existence du message
        if(channel.messages.cache.map(x => x).length == 0){
            //Suppression du channel s'il n'existe pas
            channel.delete()
            .catch(console.error);
        } else {
            //Récupération du message des statistiques
            messages.forEach(m => {
                let newMessage = "";

                //Découpage du message
                const tab = m.content.split("\n\n");
                for(i = 0; i < tab.length; i++){
                    tab[i] = tab[i].split(" : ");
    
                    //Cas du @everyone
                    let isEveryone = false;
                    if(tab[i][0] == "@everyone") isEveryone = true;
    
                    //récupération du nombre de membres ayant le role
                    let memberCount;
                    if(isEveryone) memberCount = guild.roles.cache.find(r => r.name == tab[i][0]).members.size;
                    else{
                        let roleId = tab[i][0].substring(3);
                        roleId = roleId.slice(0, -1);
                        memberCount = guild.roles.cache.find(r => r.id == roleId).members.size;
                    }
    
                    //mise à jour du nombre
                    tab[i][1] = memberCount;
    
                    //Recomposition du message
                    newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
                }
    
                //Edition du message
                m.edit(newMessage);
            })
        }
    });
}

function deleteStat(channel, role){
    //Récupération des messages du channel
    channel.messages.fetch({ limit: 1 }).then( messages => {
        //Vérification de l'existence du message
        if(channel.messages.cache.map(x => x).length == 0){
            //Suppression du channel s'il n'existe pas
            channel.delete()
            .catch(console.error);
        } else {
            //Récupération du message des statistiques
            messages.forEach(m => {
                let newMessage = "";
                //Découpage du message
                const tab = m.content.split("\n\n");
                for(i = 0; i < tab.length; i++){
                    tab[i] = tab[i].split(" : ");

                    //Extraction de l'ID du role
                    let roleId = tab[i][0].substring(3);
                    roleId = roleId.slice(0, -1);

                    //Suppression de la ligne associée
                    if(roleId == role.id){
                        tab.splice(i, 1);
                        break;
                    }

                    //Recomposition du message
                    newMessage += tab[i][0] + " : " + tab[i][1] + "\n\n";
                }

                //Edition du message
                m.edit(newMessage);
            })
        }
    });
}

module.exports = {
    updateStats,
    deleteStat
};