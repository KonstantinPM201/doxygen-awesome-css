/**

Doxygen Awesome
https://github.com/jothepro/doxygen-awesome-css

MIT License

Copyright (c) 2021 - 2023 jothepro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

class DoxygenAwesomeDarkModeToggle extends HTMLElement {
    // SVG icons from https://fonts.google.com/icons
    // Licensed under the Apache 2.0 license:
    // https://www.apache.org/licenses/LICENSE-2.0.html
    static lightModeIcon = `<svg height="20.315mm" viewBox="0 0 57.587 57.587" width="20.315mm" xmlns="http://www.w3.org/2000/svg"><title/><circle cx="28.398" cy="28.696" fill="#f5ce42" r="16.948"/></svg>`
    static darkModeIcon = `<svg height="20.315mm" viewBox="0 0 57.587 57.587" width="20.315mm" xmlns="http://www.w3.org/2000/svg"><title/><path d="M41.446,32.535A16.647,16.647,0,0,1,25.163,12.361a16.655,16.655,0,1,0,20.1,19.717A16.7,16.7,0,0,1,41.446,32.535Z" fill="#7269af"/></svg>`

    static title = "Toggle Light/Dark Mode"

    static prefersLightModeInDarkModeKey = "prefers-light-mode-in-dark-mode"
    static prefersDarkModeInLightModeKey = "prefers-dark-mode-in-light-mode"

    static _staticConstructor = function() {
        DoxygenAwesomeDarkModeToggle.enableDarkMode(DoxygenAwesomeDarkModeToggle.userPreference)
        // Update the color scheme when the browsers preference changes
        // without user interaction on the website.
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            DoxygenAwesomeDarkModeToggle.onSystemPreferenceChanged()
        })
        // Update the color scheme when the tab is made visible again.
        // It is possible that the appearance was changed in another tab 
        // while this tab was in the background.
        document.addEventListener("visibilitychange", visibilityState => {
            if (document.visibilityState === 'visible') {
                DoxygenAwesomeDarkModeToggle.onSystemPreferenceChanged()
            }
        });
    }()

    static init() {
        $(function() {
            $(document).ready(function() {
                const toggleButton = document.createElement('doxygen-awesome-dark-mode-toggle')
                toggleButton.title = DoxygenAwesomeDarkModeToggle.title
                toggleButton.updateIcon()

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                    toggleButton.updateIcon()
                })
                document.addEventListener("visibilitychange", visibilityState => {
                    if (document.visibilityState === 'visible') {
                        toggleButton.updateIcon()
                    }
                });

                $(document).ready(function(){
                    document.getElementById("MSearchBox").parentNode.appendChild(toggleButton)
                })
                $(window).resize(function(){
                    document.getElementById("MSearchBox").parentNode.appendChild(toggleButton)
                })
            })
        })
    }

    constructor() {
        super();
        this.onclick=this.toggleDarkMode
    }

    /**
     * @returns `true` for dark-mode, `false` for light-mode system preference
     */
    static get systemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    /**
     * @returns `true` for dark-mode, `false` for light-mode user preference
     */
    static get userPreference() {
        return (!DoxygenAwesomeDarkModeToggle.systemPreference && localStorage.getItem(DoxygenAwesomeDarkModeToggle.prefersDarkModeInLightModeKey)) || 
        (DoxygenAwesomeDarkModeToggle.systemPreference && !localStorage.getItem(DoxygenAwesomeDarkModeToggle.prefersLightModeInDarkModeKey))
    }

    static set userPreference(userPreference) {
        DoxygenAwesomeDarkModeToggle.darkModeEnabled = userPreference
        if(!userPreference) {
            if(DoxygenAwesomeDarkModeToggle.systemPreference) {
                localStorage.setItem(DoxygenAwesomeDarkModeToggle.prefersLightModeInDarkModeKey, true)
            } else {
                localStorage.removeItem(DoxygenAwesomeDarkModeToggle.prefersDarkModeInLightModeKey)
            }
        } else {
            if(!DoxygenAwesomeDarkModeToggle.systemPreference) {
                localStorage.setItem(DoxygenAwesomeDarkModeToggle.prefersDarkModeInLightModeKey, true)
            } else {
                localStorage.removeItem(DoxygenAwesomeDarkModeToggle.prefersLightModeInDarkModeKey)
            }
        }
        DoxygenAwesomeDarkModeToggle.onUserPreferenceChanged()
    }

    static enableDarkMode(enable) {
        if(enable) {
            DoxygenAwesomeDarkModeToggle.darkModeEnabled = true
            document.documentElement.classList.add("dark-mode")
            document.documentElement.classList.remove("light-mode")
        } else {
            DoxygenAwesomeDarkModeToggle.darkModeEnabled = false
            document.documentElement.classList.remove("dark-mode")
            document.documentElement.classList.add("light-mode")
        }
    }

    static onSystemPreferenceChanged() {
        DoxygenAwesomeDarkModeToggle.darkModeEnabled = DoxygenAwesomeDarkModeToggle.userPreference
        DoxygenAwesomeDarkModeToggle.enableDarkMode(DoxygenAwesomeDarkModeToggle.darkModeEnabled)
    }

    static onUserPreferenceChanged() {
        DoxygenAwesomeDarkModeToggle.enableDarkMode(DoxygenAwesomeDarkModeToggle.darkModeEnabled)
    }

    toggleDarkMode() {
        DoxygenAwesomeDarkModeToggle.userPreference = !DoxygenAwesomeDarkModeToggle.userPreference
        this.updateIcon()
    }

    updateIcon() {
        if(DoxygenAwesomeDarkModeToggle.darkModeEnabled) {
            this.innerHTML = DoxygenAwesomeDarkModeToggle.darkModeIcon
        } else {
            this.innerHTML = DoxygenAwesomeDarkModeToggle.lightModeIcon
        }
    }
}

customElements.define("doxygen-awesome-dark-mode-toggle", DoxygenAwesomeDarkModeToggle);
