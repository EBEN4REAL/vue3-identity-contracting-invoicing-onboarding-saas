# mm_ui_kit



## General information

This repository is contains a shared ui kit library containing common components, composables, directives, helpers and types.
It is used as a git submodule in multiple front-ends and is not intended to be a stand-alone project.

## Modifying/Adding files

To modify or add new files to the mm_ui_kit submodule, follow these instructions:

 - cd into the submodule from the parent repository (mm_front)
 - checkout to main if not already on main branch
 - create and push a new branch
 - implement desired changes, commit and push
 - create a merge request and add reviewers
 - after mm_ui_kit branch has been merged, you need to update the parent repository branch with the new mm_ui_kit hash

```
cd src/mm_ui_kit
git checkout main
git checkout -b "your-branch-name"
git push -u origin HEAD
```