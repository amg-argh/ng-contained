##ng-contained

A component wrapper for creating single page web application uses AngularJs. Contained's designed to group common content-container functionality into a single easy to use directive.

The current functionality in contained is:

 - Custom scrollbars (easily styleable, that hide when the container is not active)
 - Handle scrolling with
 -- The mouse wheel
 -- Touch
 -- Dragging the scroll bar
 - Sticky elements, having a item stick to the top of the content container when it is scrolled past
 - Notification of "waypoint" style events

##Setup
1. Include **contained.js** into your application
2. Include **contained** as a depdendency

```javascript
angular.module("testApp",["contained"])
```

3. Include contained's CSS into your project's CSS file
4. Mark the container with the **contained** directive

```html
<div contained>
	<h1>My title</h1>
    <p>My content</p>
</div>
```

##Sticky Elements
To create a sticky element, mark the element with **snoop** *because it's sticky-icky-icky*

```html
<div contained>
	<h1>My title</h1>
    <p snoop>Important information that should always be visible</p>
    <p>My content</p>
</div>
```

##Internal Anchors
To create elements that scroll contained (such as navigations) use:
- contained-anchor-link attribute on your buttons
- contained-anchor-point attribute on your targets

```html
<div contained>
	<h1>My title</h1>
    <button contained-anchor-link="reallyImportantContent">Go to really important content</button>
    <p>Not important content [...]</p>
    <p contained-anchor-point="reallyImportantContent">This is really important content [...]</p>
</div>
```

##Waypoint events
To receive notifications when an element is scrolled into view.

- Attached **waypoint** attributes (with identifiers) to elements you want to receive notifications for
- In your controller listen for a **waypoint** event

```html
<div contained>
	<h1 waypoint="one">Title one</h1>
    <p>Content one [...]</p>
    <h2 waypoint="two">Title two
    <p>Content two [...]
</div>
```

```javascript
$scope.$on("waypoint", function (e, waypoint) {
   console.log("Waypoint: '" + waypoint + "' was hit'); 
});
```