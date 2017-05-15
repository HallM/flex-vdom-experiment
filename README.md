# flex-vdom-experiment
An experiment to create a more flexible, partially immutable, efficient vdom

Most vdom implementations generally use a functional approach to building the virtual dom.
This limits the language to require balance and XHTML compliance.
They also require props to be known immediately and children to be known.

This prevents the flexibility languages such as Handlebars has by not being tightly coupled to the HTML.
Handlebars allows nodes to be opened with an If, and closed with a future If.
It also gives you the flexibility to break things and not close things. Freedom requires responsibility.
Also could have the following use case:

```
{#list}
  <div class="{.}">
{/list}
<div>Internal most div</div>
{#list}
  </div>
{/list}
```

The goal of this project is to try to create a vdom that is flexible enough to support such syntax.
Another primary goal is to keep everything efficient to keep up with functional vdom implementations.

One enhancement that can be made to keep the efficiency is a partially-immutable structure with node re-use.
Nodes are mutable until they are "finalized" and considered complete. After this point, they are immutable.
Attempting to change the props or children to a finalized node will see if the changes result in the same object.
When changes result in the same object, the node is re-used. Otherwise, a new node is created.
A parent node of a node which is being changed must also be recreated.

This style takes inspiration from Visual Studio's AST parser as well as the design for an efficient BST.
By using immutable-after-finalize, we can know what nodes have changed by a simple pointer comparison.
This should speed up the diff phase of the vdom and could even work for a React like environment.
Waiting to make a node immutable until finalize allows mutations, such as adding children,
while not spending time creating nodes which will be immediately sent to the GC.

The downside is the render function must know the previous iteration, if one exists.
As the children are created, the render has to drill down the previous iteration node for comparison.
This complicates the render by a good amount making it much more difficult to code without a compiled template language.

Since the objective of this project is aiming for supporting Handlebar's like template languages,
the complexity would be abstracted from the end user and thus is acceptable.
