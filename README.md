#Skin

A non-MVC framework.

Skin is a framework to allow module authors to tightly couple their view logic with their code, while maintaining a very easy and straightforward way to disable them or overwrite them, or use any templating engine.

Skin is *not* meant to be used on the front-end, or in production. It is meant to propose temporary, easy to use templates, that should be compiled and written to disk before production usage

### Why?

Several reasons:

  1. Prototyping: How about adding a field to your object and be able to just render the object, no files attached, no need to choose a templating engine, etc?
  2. Object-oriented dom: Easily add or remove a node, add/remove classes, change tags, on all instances or a single instance, without creating new templates, and without regex.
  3. Permission-based view: present the same data in an editable text box or a non-editable paragraph, depending on variables that you decide


### TL;DR:

	Skin.register('gallery',{
		children:{
			gallery:{
				tag:'div'
			,	classes:'gallery'
			,	value:'a gallery'
			}
		}
	})

	var description = Skin.parse(
		'.description\n'
	+	'	h3.title(style="background:red;border:1px solid black") {{title}}\n'
	+	'	span.text {{text}}'
	);

	description.children.title.attr.style.background='#ccc'
	description.children.text.attr.style = {'font-size':'90%'};

	Skin.extend(description,'gallery');

	descriptionFn = Skin(description);

	console.log(descriptionFn.styles());
	console.log(descriptionFn())

produces (line returns added for clarity):

	.description .title{
		background:#ccc;
		border:1px solid black;
	}
	.description .text{
		font-size:90%;
	}

	<div class="description">
		<h3 class="title">{{title}}</h3>
		<span class="text">{{text}}</span>
		<div class="gallery">a gallery</div>
	</div>


### How does it work?

This is a skin object describing a lightbox:

	var lightbox = {
		tag:'div'
	,	classes:['ImageBox']
	,	style:{
			width:400
		,	height:300
		,	background:'#ccc'
		,	'border-color':'1px solid white'
		}
	,	children:{
			TheImage:{
				tag:'img'
			,	id:'TheImage'
			,	attributes:{
					src: http://lorempixel.com/400/200"
				,	style:{
						'background-image':'url(loader.gif)'
					}
				}
			,	value:'this will be the alt property of the image'
			}
		,	description:{
				tag:'div'
			,	classes:'description' //you don't have to enclose it in an array
			,	style:{
					'font-size':'100%'
				}
			,	value:'some nice description'
			}
		,	close:{
				tag:'a'
			,	classes:['button','close']
			,	attributes:{
					'href':'#'
				,	style:'position:absolute;top:0;left:0'
				}
			,	value:'x'
			}
		}
	}

If this is too cumbersome, the following will output the same result:
	
	var eol = '\n';
	var text = 
		 'div.ImageBox(width="400" height="300" style="background:#ccc;border-color:1px solid white")'+eol
		+'	img#TheImage(src="http://lorempixel.com/400/200" style="background-image:url(loader.gif)") this is the alt text'+eol
		+'	div.description(style="font-size:110%") This is a very nice image'+eol
		+'	a.close.button(href="#" style="position:absolute;top:0;left:0") x';
	var lightbox = Skin.parse(text);

Once you've done that, you can extend your skin:

	Skin.extend(lightbox,{
		children:{
			description:{
				tag:'h3'
			,	attr:{
					classes:['big']
				,	style:{
						'font-size':'200%'
					}
				}
			,	value:'what a nice image'
			}
		}
	});

If you want something to not be overwritten, have your key begin with '!':

	{'!tag':'div'}

if you use extend a lot, you can register it once and for all:

	Skin.register('titleBig',{
		children:{
			title:{
				style:{
					font-size:'250%''
				}
			}	
		}
	});

after which you can do:
	
	Skin.extend(lightbox,'titleBig')

Of course, you are free to use the jade-like syntax and parse it with Skin.parse():

	Skin.register('titleBig',Skin.parse('.title(attr="250%")'))

Finally, render your skin:
	
	Skin.render(lightbox);
	Skin.render(lightbox,true); //remove styles

Or you can compile it into a function:

	var lb = Skin(lightbox,'titleBig');
	//render:
	var output = lb({description:'just another description'});

When using the function, any object passed will map to the "value" field of object. the above basically the same as doing:

	Skin.extend(lightbox,{
		children:{
			description:{
				value:'just another description'
			}
		}
	});
	Skin.render(lightbox);

With the notable difference that it doesn't overwrite the object itself

Finally, you can extract the css used in the object to write it to a css file

	var styles = Skin.extractStyles(lightbox);
	//or
	styles = Skin.extractStyles(lightbox,true) //will present styles in a pre-processor fashion, with enclosed children
	//or
	var lb = Skin(lightbox);
	styles = lb.styles();
	//or
	styles = lb.styles(true);

Once the styles have been extracted, the skin will render without them (it assumes you are re-injecting them somehow). If you want to keep them, use

	lb.noStyles = false;

The object reader is quite permissive, so you can have "styles" on the root or in the "attributes" sub-object, "attributes" might be called "attr", "class" might be called "classes", and live in attributes or on the root, and so on