Design Document
===============



#### Revision History
1. Initial Document | JAN 09, 2014 | Won Song



### Purpose



### High Level Entities

##### Editor Module

Editor module defines the HTML representation of the editor template that will be added to the place holder on the page load.


##### Event Module

Event Module registers various events used in the editor.


##### Keystroke Handler Module

KeyStoke Handler Module defines event handlers related to key strokes.


##### Processor Module

Processor Module defines the code transation functionalities.


##### Utility Module

Utility Module defines set of utility methods that can be used from various modules.


##### Loader Module

Loads all the modules on the pageload and starts the application.


### Low Level Entities

##### Editor Module

1. getEditorTemplate() method: 
Returns a string containing HTML defining the structure of the editor.
 
##### Event Module

1. registerEditorEvents() method:
Registers various mouse click events such as View Editor button click and View Preview button click.

##### Processor Module

1. process() method:
the process() method takes in a string value representing the process type, and returns the processed document.

### Sequence of event
