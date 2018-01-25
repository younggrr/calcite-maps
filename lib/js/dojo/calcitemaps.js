/* ========================================================================
 * Calcite Maps: calcitemaps.js v0.2 (dojo)
 * ========================================================================
 * Generic handlers for mapping-specific UI
 *
 * ======================================================================== */

define([ 
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/query",
  "dijit/focus",
  "dojo/dom-class",
  "dojo/on",
  "dojo/NodeList-traverse",
  "dojo/domReady!"
], function(declare, lang, array, query, focusUtil, domClass, on) {

  var CalciteMaps = declare(null, {

    constructor: function () {
      
      // this.initEvents();

    },

    //--------------------------------------------------------------------------
    //
    //  Public
    //
    //--------------------------------------------------------------------------

    dropdownMenuItemSelector: ".calcite-navbar .calcite-dropdown li > a",

    autoCollapsePanel: true,

    preventOverscrolling: true,

    activePanel: null,

    stickyDropdownDesktop: false, 

    stickyDropdownMobile: false,

    stickyDropdownBreakpoint: 768,

    focusFirstDropdownItem: true, // This option should be true for accessibility purposes

    escapeToClose: true, // This option should be true for accessibility purposes

    init: function (args) {

      lang.mixin(this, args);
      this.initEvents();

    },

    //----------------------------------
    // Initialize Handlers
    //----------------------------------

    initEvents: function() {

      this.setDropdownItemEvents();
      this.setDropdownToggleEvents();
      this.setToggleNavbarClick();
      this.setPanelEvents();

    },

    //----------------------------------
    // Dropdown Menu Item Events
    //----------------------------------

    setDropdownItemEvents: function() {

      var funcContext = function setNavbarEvents(e) {

        if (e.type === "keydown" && e.keyCode !== 13) {
          return;
        }
        
        var isPanel = false,
          panel = null,
          panelBody = null,
          panels = null;

        if (e.currentTarget.dataset.target) {
          panel = query(e.currentTarget.dataset.target);
          if (panel.length > 0) {
            isPanel = domClass.contains(panel[0], "panel");
          }
        }

        // Toggle panels
        if (isPanel) {
          panelBody = query(panel).query(".panel-collapse");
          // Show
          if (!domClass.contains(panel[0], "in")) {
            // Close panels
            panels = query(panel).parent().query(".panel.in");
            panels.collapse("hide");
            // Close bodies
            query(panels).query(".panel-collapse").collapse("hide");
            // Show panel
            panel.collapse("show");
            // Show body
            query(panelBody[0]).collapse("show");
          } else { // Re-show
            panel.removeClass("in");
            query(panelBody[0]).removeClass("in");
            panel.collapse("show");
            query(panelBody[0]).collapse("show");
          }
          if (panel) {
            if (e.keyCode === 13) {
              
              focusUtil.focus(panel.query(".panel-title")[0]);
            }
          } 
          
          if (e.type === "click") {
          // Dismiss dropdown automatically
          var isMobile = window.innerWidth < this.stickyDropdownBreakpoint;
          if (isMobile && !this.stickyDropdownMobile || !isMobile && !this.stickyDropdownDesktop) {
            var toggle = query(".calcite-dropdown .dropdown-toggle")[0];
            on.emit(toggle, "click", { bubbles: true, cancelable: true });
          }}
          this.activePanel = panel;
        }
      }.bind(this);

      // Show/hide panels

      query(this.dropdownMenuItemSelector).on(["click","keydown"], lang.hitch(this, funcContext)); 

    },

    //----------------------------------
    // Manually show/hide the dropdown
    //----------------------------------

    setDropdownToggleEvents: function() {
      
      // Manually show/hide the dropdown
      query(".calcite-dropdown .dropdown-toggle").on(["click","keydown"], lang.hitch(this,function (e) {
      if (e.type === "keydown" && e.keyCode !== 13) {
        return;
      }
      
      query(e.currentTarget).parent().toggleClass("open");
      query(".calcite-dropdown-toggle").toggleClass("open");

      //Sets the focus on the first drop-down item when the menu is toggled open
      if (this.focusFirstDropdownItem && domClass.contains(query(".calcite-dropdown")[0],"open")) {
       
        focusUtil.focus(query('.dropdown-menu li:first-child a')[0]);
      }

    }));
      // }));
   
      query(".calcite-dropdown").on("hide.bs.dropdown", function () {
        query(".calcite-dropdown-toggle").removeClass("open");
      });

    
      // Submenu

      // Dismiss dropdown menu
      if (!this.stickyDropdownDesktop) {
      query(window).on("click", function (e) {
        var menu = query(".calcite-dropdown.open")[0];
        if (menu) {
          if (query(e.target).closest(".calcite-dropdown").length === 0) {
            query(menu).removeClass("open");
            query(".calcite-dropdown-toggle").removeClass("open");
          }
        }
      });
    }
    },

    //----------------------------------
    // Toggle navbar hidden
    //----------------------------------

    setToggleNavbarClick: function() {

      query("#calciteToggleNavbar").on("click", function(e) {
        if (!domClass.contains(query("body")[0],"calcite-nav-hidden")) {
          query("body").addClass("calcite-nav-hidden");
        } else {
          query("body").removeClass("calcite-nav-hidden");
        }
        var menu = query(".calcite-dropdown .dropdown-toggle")[0];
        if (menu) {
          on.emit(menu, "click", { bubbles: true, cancelable: true });
        }
      });

    },

    //----------------------------------
    // Panel Collapse Events
    //----------------------------------

    setPanelEvents: function() {
      
      query(".panel-close").on("keydown", lang.hitch(this,function (e) {

        if (e.keyCode == 13) {
          var id = query(e.target).parents(".panel")[0].id;
          this.closePanel(query(e.target).parents(".panel.in")[0]);
          // this.focusMenu(id);
        }

      }));

      query(".calcite-panels .panel .panel-collapse").on("hidden.bs.collapse", lang.hitch(this, function(e) {
        if (domClass.contains(query(".calcite-dropdown")[0],"open")) {
          this.focusMenu(query(this.activePanel)[0].id);
        }
        
        
      }));

      if (this.autoCollapsePanel) {
        // Hide
        query(".calcite-panels .panel .panel-collapse").on("hidden.bs.collapse", function(e) {
          query(e.target.parentNode).query(".panel-label, .panel-close").addClass("visible-mobile-only");
        });
        //Show
        query(".calcite-panels .panel .panel-collapse").on("show.bs.collapse", function(e) {
          query(e.target.parentNode).query(".panel-label, .panel-close").removeClass("visible-mobile-only");
        });
      }

      if (this.escapeToClose) {

        
        
        query(document).on("keydown", lang.hitch(this, function (e) {
          
        
          if (e.keyCode != 27) {
          
            return;
        
          }

          // // Close panels
          if (query(".panel.in").length > 0) {
            this.closePanels();
          } else if (domClass.contains(query(".calcite-dropdown")[0],"open")) {
            var menu = query(".calcite-dropdown.open")[0];
            if (menu) {
             
                query(menu).removeClass("open");
                query(".calcite-dropdown-toggle").removeClass("open");
                this.focusMenu();
             
            }
          }
          
          // Set focus on the drop-down menu
          // this.focusMenu();
          

        }));

      }
      
    },

    closePanel: function (panel) {
      var id = query(panel).id;
      query(panel).collapse("hide");
      query(panel).query(".panel-collapse").collapse("hide");
    

    },

    closePanels: function () {

      var panels = query(".panel.in");
      array.forEach(panels, lang.hitch(this,function (entry, i) {
        this.closePanel(entry);

      }));

    },

    focusMenu: function (id) {
      if (id) {
        focusUtil.focus(query("a[data-target='#" + id + "']")[0]);
      } else {
        focusUtil.focus(query(".dropdown-toggle")[0]);
      }
      

    }

  });
      
  return new CalciteMaps();
});