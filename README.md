JadEdit
=======

JadEdit is an embeddable JavaScript editor that allows you to create web documents using Jade template syntax. JadEdit is very similiar to MarkDown except that JadEdit uses more developer-friendly HTML-like syntax.

JadEdit is currently in an early stage of development, and there are currently no release. However, you can find out more about our project @ http://jadedit.com.

Thanks!


## Functional Requirements

https://github.com/WonSong/JadEdit/blob/master/docs/FuctionalRequirements.md

## Design Document

https://github.com/WonSong/JadEdit/blob/master/docs/DesignDocument.md

## How to Build

The source code for JadEdit has been moduralized for better readability and testability. 
As there is no official release, the project needs to be built before it can be used.

in order to build the project, you will need the following:
1. Python
2. Java Runtime Environment.

The build script resides in the /tools folder.

$ python build.py

Running the above script will create two new files on /build folder: one regular, and one minified.
