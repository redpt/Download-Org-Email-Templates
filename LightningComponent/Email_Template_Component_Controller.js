public class TEST_CONTROLLER {
	@AuraEnabled
    public static List<retObj> returnFolderTeplates() {
        //return [SELECT Folder.DeveloperName, DeveloperName FROM EmailTemplate WHERE Folder.DeveloperName = :folderName];
        List<EmailTemplate> templates = [SELECT Folder.DeveloperName, DeveloperName FROM EmailTemplate ORDER BY Folder.DeveloperName];
        Map<String, List<String>> completeList = new Map<String, List<String>>();
        List<retObj> retVal = new List<retObj>();
        retObj temp;
        String folderName = '';
        for(EmailTemplate template: templates){
            temp = new retObj();
            if(((Folder)template.Folder)==null){
				folderName = 'unfiled$public';
            }else{
				folderName = ((Folder)template.Folder).DeveloperName;
            }
            if(completeList.get(folderName)==NULL){
                completeList.put(folderName, new List<String>{template.DeveloperName});
            }else{
				completeList.get(folderName).add(template.DeveloperName);
            }
        }
        for(String key: completeList.keySet()){
            temp = new retObj();
            temp.listOfTemplateNames = completeList.get(key);
            temp.key = key;
            retVal.add(temp);
        }
        return retVal;
    }
    public class retObj{
        @AuraEnabled
        List<String> listOfTemplateNames {get; set;}
        @AuraEnabled
        String key {get; set;}
    }
}