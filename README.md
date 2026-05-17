This is my personal portfolio website that is inspired by the frontend design of the Windows XP operating system. The creative freedom of designing a personal website is refreshing. 

# Front End HTML

The HTML boiler plate is contained within index.html. In this file all of the containers that the JavaScript will later populate with interactive windows. 

In order to design a realistic desktop environment we must also modify the right click context menu. This is very easily done with the "oncontextmenu" attribute that can be assigned to our custom JavaScript. When this is executed the defined context menu later in the file will become visible. 

~~~HTML
<!-- Desktop Div -->
<div class="xp-desktop" id="desktop" oncontextmenu="showContextMenu(event)">
  <div class="xp-icons" id="desktop-icons"></div>
  <div id="windows-container"></div>
</div>

...

<!-- Context menu -->
<div class="xp-contextmenu" id="contextmenu">
  <div class="xp-context-item" onclick="closeContextMenu()">Arrange Icons By ▶</div>
  <div class="xp-context-item" onclick="closeContextMenu();location.reload()">Refresh</div>
  <div class="xp-context-sep"></div>
  <div class="xp-context-item" onclick="closeContextMenu()">Properties</div>
</div>
~~~

Through the use of the id and class feature we can easily link the other "div" tags with their attributes in the JavaScript and CSS files. 

Overall the HTML is quite simple due to the nature of the processing being largely reliant on the backend JavaScript.

# Front End CSS

The CSS code to control the Windows XP desktop is contained within the winxp.css file. This code has no impressive design elements due to most of the functionality of the website being handled by the JavaScript. Due to the nature of my design skills I relied heavily on Claude to generate the bulk of the styling.

The main feature of note is the modularity. The base colors and font preferences are defined as variables in the following code snippet. This modularity is standard in professional design in order to reduce the amount of conflict when those large attributes need to be changed. 
~~~CSS 
:root {
  --xp-blue:       #003c74;
  --xp-blue-mid:   #0054a6;
  --xp-blue-light: #2080d0;
  --xp-window-bg:  #ece9d8;
  --xp-font:       Tahoma, 'Segoe UI', 'MS Sans Serif', sans-serif;
  --xp-taskbar-h:  38px;
}
~~~

# JavaScript

This section of the write up will certainly be the most interesting. The bulk of the interesting interaction that you can view on the website is made via the files under the js folder.

### winxp.js
This file is at the center of the JavaScript design of this webpage. The first few function provide the desktop space with basic functionality and interactivity such as icon selection highlighting, clock updating, and profile picture fallback. 

The window management portion contains the most important feature of this entire project which is window interactivity. Within the ```openWindow``` function we should focus on the following bit of code.

~~~JavaScript
const win = document.createElement('div');
  win.className = 'xp-window focused';
  win.id = `win-${pageId}`;
  win.style.cssText = `left:${90+offset}px;top:${30+offset}px;width:${w}px;height:${h}px;position:absolute;display:flex;flex-direction:column;`;
  win.innerHTML = buildWindowShell(pageId, pg);
  document.getElementById('windows-container').appendChild(win);

  //Inject Content
  const contentEl = win.querySelector('.xp-window-content');
  contentEl.innerHTML = `<div style="padding:20px;color:#888;font-size:12px;font-family:Tahoma,sans-serif;">Loading...</div>`;
  const html = await pg.render();
  contentEl.innerHTML = `<div class="page-body">${html}</div>`;

  win.addEventListener('mousedown', () => focusWindow(win));
  focusWindow(win);
~~~

The function this is inside manages the creation of windows based on a standard template and injects the correct content based on the ```pageID``` argument. In the code above we can see the creation of a window in the first line and the injection of the HTML for the correct page with the passed variable ```${html}```. The boiler plate code is contained within the ```buildWindowShell(pageId, pg)``` function which immediately returns the base HTML for the windows. Following this section there is content renderers which basically hold the HTML for each individual window.

### github.js
A notable feature of this website that is not apparent on first inspection is the auto population of the projects window. Due to the constantly changing projects I am working on I decided that it would be easier to query GitHub than to edit my website every time I started or finished a project. 

To start the explanation we need to first look at the ```renderProjects()``` function inside of winxp.js. In this we call the function ```fetchGitHubProjects()``` which is defined in github.js. Once receiving all of the information from that function it then displays it with HTML code.

Inside the github.js file the most important piece is the aforementioned function. This function queries the GitHub API and filters the response. The following code is the filter portion.

~~~JavaScript
 _reposCache = repos
      .filter(r => !r.fork)                        // skip forks
      .filter(r => !r.archived)                    // skip archived
      .filter(r => !exclude.has(r.name))           // skip excluded
      .map(r => ({
        name:        r.name,
        description: r.description || "No description provided.",
        tech: r.topics && r.topics.length > 0
            ? r.topics.map(t => TOPIC_LABELS[t] || t)
            : r.language ? [LANG_LABELS[r.language] || r.language] : [],
        github:      r.html_url,
        live:        r.homepage && r.homepage !== "" ? r.homepage : "#",
        year:        new Date(r.created_at).getFullYear().toString(),
        stars:       r.stargazers_count,
        forks:       r.forks_count,
      }))
      .sort((a,b) => b.year - a.year);
~~~

In this code snippet we can see the filters applied to the data to get only the desired repositories. Once this is completed we map all repositories with their values. Finally, we sort them by year and return this map. This will ultimately be displayed once going through the ```fetchGitHubProjects()``` function. 

### data.js
This file is very self explanatory. It is a glorified .json file that holds all my data. This is in order to have quick edit access to the entire website without getting into the nitty gritty of the code. 

