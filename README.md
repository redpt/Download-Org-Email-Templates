# Download-Org-Email-Templates
This is the Readme file for obtaining a process by which you can download Email Templates from an org where changesets are not expected to work (such as deployment between two orgs that do not have a sandbox/prod relationship).

There are two processes:
1) Lightning Component from which to copy all <members> tags
2) Terminal Command that retrieves all of the templates

For 1), you are assumed to have a project saved locally in a directory. You also are assumed to have a package.xml file that dictates exactly which files you expect to download from an org. Normally, you use a wildcard in the <members> tag to obtain all of the metadata files. This does not work for Email templates. You must have the folder names and you must have the email template names along with the folder names.

Example of package.xml contents that will not work because it uses wildcard:
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>*</members>
        <name>EmailTemplate</name>
    </types>
    <version>46.0</version>
</Package>

1: In the org from which you need the templates, create a new Lightning App file and copy the contents of the .app file in this directory into that file.

2: Additionally, create a Lightning Component for the componennt within this LightningComponent directory and copy the contents from this directory into the component, taking care to preserve the naming structure and taking care to copy the .
cmp file into the component, the .js file in to the controller, and the .apxc file into the apex controller.

3: Test the new app in you org's console. It should show all of the email templates and folders that you're going to download and it should have already formatted them with correct spacing and <members>/</members> tages.

4: Copy the output contents of the Lightning App into your package.xml file
********************************************************************************************************

For 2), assuming you already have an active and authorized project directory, simply paste this into your terminal:
emails="`sfdx force:data:soql:query -q "select Id, Name, DeveloperName, NamespacePrefix, Folder.DeveloperName, Folder.NamespacePrefix, FolderId from EmailTemplate" -r json | jq -r '.result.records[] | "EmailTemplate:" + if (.Folder) then if (.Folder.NamespacePrefix) then .Folder.NamespacePrefix + "__" else "" end + .Folder.DeveloperName else "unfiled$public" end + "/" + if (.NamespacePrefix) then .NamespacePrefix + "__" else "" end + .DeveloperName + ","' | tr -d '\n'`"
sfdx force:source:retrieve -m "${emails%%,}"

This is assuming you have "tr" installed.

********************************************************************************************************
Note:
    There are some differences betweent the two. There have been issues with both regarding templates installed from a managed package, though their problems do not exactly match 1:1. The second option appears to be more concise, but still can have issues.