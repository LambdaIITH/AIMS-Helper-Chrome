# AIMS-Helper

The Google Chrome version of a cross-browser helper extension for the **AIMS Portal**, IIT Hyderabad. It is available at https://chrome.google.com/webstore/detail/aims-helper/njgpoifkefbbhjohcadcngdomfifcflj?hl=en. 

## Installation

1. Clone the directory to your local machine.
2. `cd` into your local copy, and run `npm install`. 
3. Fire up **Google Chrome**, go to chrome://extensions and switch on **Developer Mode**. 
4. Click on **Load Unpacked**, navigate to the cloned directory and select it. 

Google Chrome will now install the AIMS-Helper extension. 

## Usage

1. Navigate to your **AIMS Course Registration Page** in Chrome, click on the **A** logo in your Chrome extensions bar and click on **Generate Timetable**. A new tab should open, containing your timetable. 
2. Click on **Download PDF** to download a PDF copy of your timetable. 
3. Click on **Upload timetable** to upload a copy of your timetable, which can then be accessed with the IITH Dashboard app. 

## Development 
1. Install the extension locally as given in the installation instructions. 
2. Whenever you make a change, please run `npx webpack` in the repostory's root directory to build the changes.
3. Make sure you test your code prior to committing changes. 

**Note:**  There are pre-commit hooks installed to auto-format and lint your code. If you want to test these pre-commit hooks, you can run them through the command: ` bash  .git/hooks/pre-commit`.
## Support

Write to lambda@iith.ac.in. 
