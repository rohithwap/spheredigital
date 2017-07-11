/* THREE SCENES*/

function scene_1(){

var stats = initStats();

// create a scene, that will hold all our elements such as objects, cameras and lights.
var scene = new THREE.Scene();

// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// create a render and set the size
var webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.shadowMapEnabled = true;


// position and point the camera to the center of the scene
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3(10, 0, 0));

// add the output of the renderer to the html element
$("#landing-canvas").append(webGLRenderer.domElement);

// call the render function
var step = 0;

var knot;

// setup the control gui
var controls = new function () {
// we need the first child, since it's a multimaterial
this.radius = 40;
this.tube = 28.2;
this.radialSegments = 600;
this.tubularSegments = 12;
this.p = 5;
this.q = 4;
this.heightScale = 4;
this.asParticles = true;
this.rotate = true;

this.redraw = function () {
// remove the old plane
if (knot) scene.remove(knot);
// create a new one
var geom = new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments), Math.round(controls.tubularSegments), Math.round(controls.p), Math.round(controls.q), controls.heightScale);

if (controls.asParticles) {
knot = createParticleSystem(geom);
} else {
knot = createMesh(geom);
}

// add it to the scene.
scene.add(knot);
};

}

var gui = new dat.GUI();
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
gui.add(controls, 'heightScale', 0, 5).onChange(controls.redraw);
gui.add(controls, 'asParticles').onChange(controls.redraw);
gui.add(controls, 'rotate').onChange(controls.redraw);

gui.close();

controls.redraw();

render();

// from THREE.js examples
function generateSprite() {

var canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;

var context = canvas.getContext('2d');
var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
gradient.addColorStop(1, 'rgba(0,0,0,1)');

context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);

var texture = new THREE.Texture(canvas);
texture.needsUpdate = true;
return texture;

}

function createParticleSystem(geom) {
var material = new THREE.PointCloudMaterial({
color: 0xffffff,
size: 3,
transparent: true,
blending: THREE.AdditiveBlending,
map: generateSprite()
});

var system = new THREE.PointCloud(geom, material);
system.sortParticles = true;
return system;
}

function createMesh(geom) {

// assign two materials
var meshMaterial = new THREE.MeshNormalMaterial({});
meshMaterial.side = THREE.DoubleSide;

// create a multimaterial
var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

return mesh;
}

function render() {
stats.update();

if (controls.rotate) {
knot.rotation.y = step += 0.01;
}

// render using requestAnimationFrame
requestAnimationFrame(render);
webGLRenderer.render(scene, camera);
}

function initStats() {

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

// $("#Stats-output").append(stats.domElement);

return stats;
}
}

/* Frame 2 */

function scene_2(){

var mouseX = 0,
mouseY = 0,
windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,
SEPARATION = 200,
AMOUNTX = 10,
AMOUNTY = 10,
camera,
scene,
renderer;

init();
animate();

function init() {

var container,
separation = 100,
amountX = 50,
amountY = 50,
particle;

container = document.createElement( 'div' );
$("#about-canvas").append(container);

scene = new THREE.Scene();

renderer = new THREE.CanvasRenderer({ alpha: true }); // gradient; this can be swapped for WebGLRenderer
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
1,
10000
);
camera.position.z = 100;

// particles
var PI2 = Math.PI * 2;
var material = new THREE.SpriteCanvasMaterial({
color: 0xffffff,
program: function ( context ) {
context.beginPath();
context.arc( 0, 0, 0.5, 0, PI2, true );
context.fill();
}
});

var geometry = new THREE.Geometry();

for ( var i = 0; i < 100; i ++ ) {
particle = new THREE.Sprite( material );
particle.position.x = Math.random() * 2 - 1;
particle.position.y = Math.random() * 2 - 1;
particle.position.z = Math.random() * 2 - 1;
particle.position.normalize();
particle.position.multiplyScalar( Math.random() * 10 + 450 );
particle.scale.x = particle.scale.y = 10;
scene.add( particle );
geometry.vertices.push( particle.position );
}

// lines
var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
scene.add( line );

// mousey
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

window.addEventListener( 'resize', onWindowResize, false );

} // end init();

function onWindowResize() {

windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

mouseX = event.clientX - windowHalfX;
mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

if ( event.touches.length > 1 ) {

event.preventDefault();

mouseX = event.touches[ 0 ].pageX - windowHalfX;
mouseY = event.touches[ 0 ].pageY - windowHalfY;

}
}

function onDocumentTouchMove( event ) {

if ( event.touches.length == 1 ) {

event.preventDefault();

mouseX = event.touches[ 0 ].pageX - windowHalfX;
mouseY = event.touches[ 0 ].pageY - windowHalfY;

}
}

function animate() {

requestAnimationFrame( animate );
render();

}

function render() {

camera.position.x += ( mouseX - camera.position.x ) * .05;
camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
camera.lookAt( scene.position );

renderer.render( scene, camera );

}
}

/* Frame 3*/

function scene_3(){


            var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight,
            mouseX = 0, mouseY = 0,
            windowHalfX = window.innerWidth / 2,
            windowHalfY = window.innerHeight / 2,
            SEPARATION = 200,
            AMOUNTX = 10,
            AMOUNTY = 10,
            camera, scene, renderer;
            init();
            animate();
            function init() {
                var container, separation = 100, amountX = 50, amountY = 50,
                particles, particle;
                container = document.createElement('div');
                $("#services-canvas").append(container);
                camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / 2 / SCREEN_HEIGHT, 1, 10000 );
                camera.position.z = 1000;
                scene = new THREE.Scene();
                renderer = new THREE.CanvasRenderer();
                renderer.setSize( window.innerWidth / 2, window.innerHeight );
                container.appendChild( renderer.domElement );
                // particles
                var PI2 = Math.PI * 2;
                var material = new THREE.SpriteCanvasMaterial( {
                    color: 0xffffff,
                    program: function ( context ) {
                        context.beginPath();
                        context.arc( 0, 0, 0.5, 0, PI2, true );
                        context.fill();
                    }
                } );

                for ( var i = 0; i < 1000; i ++ ) {
                    particle = new THREE.Sprite( material );
                    particle.position.x = Math.random() * 2 - 1;
                    particle.position.y = Math.random() * 2 - 1;
                    particle.position.z = Math.random() * 2 - 1;
                    particle.position.normalize();
                    particle.position.multiplyScalar( Math.random() * 10 + 450 );
                    particle.scale.multiplyScalar( 2 );
                    scene.add( particle );
                }
                // lines
                for (var i = 0; i < 300; i++) {
                    var geometry = new THREE.Geometry();
                    var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
                    vertex.normalize();
                    vertex.multiplyScalar( 450 );
                    geometry.vertices.push( vertex );
                    var vertex2 = vertex.clone();
                    vertex2.multiplyScalar( Math.random() * 0.3 + 2 );
                    geometry.vertices.push( vertex2 );
                    var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x03f470, opacity: Math.random() } ) );
                    scene.add( line );
                }
                document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                document.addEventListener( 'touchstart', onDocumentTouchStart, false );
                document.addEventListener( 'touchmove', onDocumentTouchMove, false );
                //
                window.addEventListener( 'resize', onWindowResize, false );
            }
            function onWindowResize() {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
            //
            function onDocumentMouseMove(event) {
                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
            }
            function onDocumentTouchStart( event ) {
                if ( event.touches.length > 1 ) {
                    event.preventDefault();
                    mouseX = event.touches[ 0 ].pageX - windowHalfX;
                    mouseY = event.touches[ 0 ].pageY - windowHalfY;
                }
            }
            function onDocumentTouchMove( event ) {
                if ( event.touches.length == 1 ) {
                    event.preventDefault();
                    mouseX = event.touches[ 0 ].pageX - windowHalfX;
                    mouseY = event.touches[ 0 ].pageY - windowHalfY;
                }
            }
            //
            function animate() {
                requestAnimationFrame( animate );
                render();
            }
            function render() {
                camera.position.x += ( mouseX - camera.position.x ) * .05;
                camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
                camera.lookAt( scene.position );
                renderer.render( scene, camera );
            }
        

}

/* Frame 4 */

function scene_4(){

    var SEPARATION = 100,
    AMOUNTX = 100,
    AMOUNTY = 70;

    var container, stats;
    var camera, scene, renderer;

    var particles, particle, count = 0;

    var mouseX = 0,
        mouseY = 0;
    var bgColor = '#FFF';

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {

        container = document.createElement('div');
        $("#team-canvas").append(container);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 10000;

        scene = new THREE.Scene();

        particles = new Array();

        var PI2 = Math.PI * 2;
        var material = new THREE.SpriteCanvasMaterial({

            color: '#00BCD4',
            program: function(context) {

                context.beginPath();
                context.arc(0, 0, 0.5, 0, PI2, true);
                context.fill();

            }

        });

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {

            for (var iy = 0; iy < AMOUNTY; iy++) {

                particle = particles[i++] = new THREE.Sprite(material);
                particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                scene.add(particle);

            }

        }

        renderer = new THREE.CanvasRenderer();
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(bgColor);
        container.appendChild(renderer.domElement);

        /*stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);*/

        //

        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //

    //

    function animate() {

        requestAnimationFrame(animate);

        render();
        //stats.update();

    }

    function render() {

        camera.position.set(0, 355, 122);

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {

            for (var iy = 0; iy < AMOUNTY; iy++) {

                particle = particles[i++];
                particle.position.y = (Math.sin((ix + count) * 0.3) * 50) +
                    (Math.sin((iy + count) * 0.5) * 50);
                particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 +
                    (Math.sin((iy + count) * 0.5) + 1) * 4;

            }

        }

        renderer.render(scene, camera);

        count += 0.1;

    }

}


 <!-- // IE Jump Fix -->
    
        /* Init Dropdowns*/
        $('.dropdown').dropdown();

        /* Show/Hide Munu */
        $('.menu-toggle').click(function(){
            $('.menu').toggleClass('open');
        }) 


        /* Service modal */
        var service = [];
        service[0] = "<img class='jelly' src='images/comp.png'><p>Our team of designers and web developers revel in creating stunning, user-friendly digital platforms that engage our client’s audience. The best websites are not only visually stunning, but have the power and functionality to match their good looks. As the Internet has developed, so has best practise website development. We employ some of the very best web development techniques to execute our client’s work and are constantly developing our skills with the latest techniques that come into the market.</p>";
        service[1] = "<img class='jelly' src='images/social.png'><p>The great thing about social media marketing is we know who these people are – how old they are, where they are situated, what brands they like, even if they are married or single. Never before in the history of marketing have we had such targeted access to the public, without an expensive market research exercise.</p><p>These days almost every industry is being affected in some way by the power of social networks and the virility of online communication. With a well thought out social media strategy, your business can generate market leading customer engagement, create more brand awareness, encourage consistent website traffic, assist new sales or create a new direct revenue stream for your website or store.</p>";
        service[2] = "<img class='jelly' src='images/content.png'><p>In a world dominated by marketing, both online and offline, how do you make your business stand out? The key is engaging content. In our crowded content age, your business content needs a competitive edge. Content Marketing is the strategic approach that we can use to help you find, engage, entertain, educate and retain your key customers.We provide the strategic vision, creative insight and resources you need to create powerful content and drive conversion. We produce, curate, distribute and amplify your content, growing your audience and boosting SEO at the same time.</p>";
        service[3] = "<img class='jelly' src='images/search.png'><p>Once, Search Engine Optimisation in India or internationally was considered an added bonus but not essential to a business’s ROI. Today, lacking an optimised internet presence is one of the main reasons businesses fail. Search engine optimisation is crucial to online marketing success. Being found online in search engines is not just a luxury, it’s a necessity in today’s competitive marketplace. A well-designed search engine optimisation program helps potential customers find you. This means you get more leads. Coupled with a good conversion strategy, you’ll get more referrals and ultimately, more sales.</p>";
        service[4] = "<img class='jelly' src='images/email.png'><p>Email marketing is all about reaching out directly to customers to promote your business. Email marketing (sometimes referred to as EDMs) is an effective way of re-engaging your existing customers or website visitors by sending them targeted and relevant messages straight to their inboxes.</p>";
        service[5] = "<img class='jelly' src='images/conversion.png'><p>Your website could be getting a lot of visitors but you’re wondering why they aren’t buying or enquiring. Understanding what your website visitors are looking for is an important part of Conversion Rate Optimisation (CRO) and it helps increase the amount of online sales, enquiries or any other desired action on your website. It demands a targeted strategy, an holistic approach to channel management and rigorous testing based on real consumer insight and analysis. We help make your website more effective at closing a sale by making sure all parts of your digital sales funnel are working together.</p>";

        

        <!-- // ANIMATE!!! -->

    var sm1 = anime({
          targets: '#small_2',
          translateX: 100,
          translateY: 100,
          rotateY: 560,       
          loop: true,
          duration: 10000,
          easing: 'easeInOutQuart'
        });

        var basicTimeline = anime.timeline();
        basicTimeline
            .add({
                targets: '#Small_Clouds',
                translateX: 2000,
                duration: 30000,
                loop: true,
                easing: 'linear',
                delay: 5000
            })
            .add({
                targets: '#big-clouds',
                translateX: 1220,
                duration: 60000,
                loop: true,
                easing: 'linear',
                delay: 1000
            })
            .add({
                targets: '.bird',
                translateX: 12200,
                duration: 10000,
                loop: true,
                easing: 'linear',
                delay: 10000
            })
            .add({
                targets: '.many-birds',
                translateX: 2000,
                duration: 40000,
                loop: true,
                easing: 'linear',
                delay: 10000
            })
            .add({
                targets: '#window',
                fill: '#e8c700',
                easing: 'easeOutExpo',
                offset: 20000
            })
            .add({
                targets: '#window',
                fill: '#787563',
                easing: 'easeOutExpo',
                offset: 30000
            })

        

        var graphTimeline = anime.timeline({
            loop: true
        });
        graphTimeline
            .add({
                targets: '.bar-a',
                d: "M325.349,267.126c-17.054,0-51.161,174.388-68.217,174.388h136.433    C376.514,441.514,342.405,267.126,325.349,267.126z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-b',
                d: "M507.751,311.164c-15.466,0-46.398,130.35-61.864,130.35h123.717    C554.144,441.514,523.212,311.164,507.751,311.164z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-c',
                d: "M123.006,440.698c17.667-11.771,49.591-115.005,65.908-115.005s48.241,103.234,65.909,115.005     c0.8,0.534,1.571,0.813,2.308,0.813h-68.217h-68.217L123.006,440.698z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-d',
                d: "M598.218,281.573c17.055,0,51.162,159.939,68.219,159.939h-68.219h-68.215     C547.054,441.513,581.166,281.573,598.218,281.573z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-e',
                d: "M386.284,278.063c15.466,0,46.393,163.449,61.858,163.449h-123.72     C339.889,441.512,370.818,278.063,386.284,278.063z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-f',
                d: "M450.493,52.219c17.056,0,51.163,389.29,68.219,389.29H382.278     C399.329,441.509,433.441,52.219,450.493,52.219z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-g',
                d: "M200.538,440.879c16.021-9.254,44.973-199.891,59.768-199.891c14.793,0,43.744,190.637,59.766,199.891     c0.726,0.413,1.422,0.63,2.093,0.63h-61.859h-61.861L200.538,440.879z",
                duration: 300,
                easing: "linear"
            })
            .add({
                targets: '.bar-h',
                d: "M631.467,342.275c15.466,0,46.398,99.233,61.864,99.233h-61.864h-61.863     C585.07,441.509,616.001,342.275,631.467,342.275z",
                duration: 300,
                easing: "linear"
            })

        var homeAnim = anime.timeline();

        homeAnim
            .add({
                targets: '#thex5F_lines polygon',
                fill: '#03789c',
                easing: 'easeOutExpo',
                offset: '+1000',
                opacity: {
                    value: [0, 1],
                    duration: 200,
                    easing: 'easeInOutSine'
                }
            })

        /* On DOM LOAD*/   
       
        $(document).ready(function() { 
            
            /* Init All Three.js Scenes*/
            scene_1();
            scene_2();
            scene_3();
            scene_4();

            /* Throw in some form validation */

            $('.ui.form')
              .form({
                fields: {
                  q3_firstName      : 'empty',
                  q4_lastName       : 'empty',
                  q6_email6         : 'email',
                  q7_phone          : 'empty',
                  q9_country        : 'empty',
                  q8_message        : 'empty'
                }
              })
            ;
            

            /* Init Howler */
            sound_waves = new Howl({
                src: ['audio/waves.mp4'],
                autoplay: true,
                loop: true,
                volume: 0.2
            });

            $('.sound-toggle').on('click',function(){
                if(sound_waves.playing()){
                    $(this).html("&#xE04F;")
                    sound_waves.pause();                                        
                }else{
                    sound_waves.play();
                    $(this).html("&#xE050;")
                }
            })

            /* ALl Done, Remove Preloader*/
            $('#preloader').fadeOut(300,function(){
                $('.pusher').fadeIn(500);
            })

            /*// Functions That Depend on Viewport Size //*/    

            if(screen.width < 600) { 
            
            /*  Mobile -------------*/
            /* Smooth Scroll For Mobile */
            $('a').on('click',function (e) {
               $('.menu').removeClass('open')
               var el = $(this).data("nav");
                $('html, body').animate({
                  scrollTop: $(el).offset().top
                }, 500);
                
            });

            /* Service Modal Mobile*/   
            $('.mo').on('click',function() {

                var id = $(this).data(id);
                var no = id['id'];
                
                if ($(this).closest('.ser').find('.mobile-service-modal').length) {
                    $(this).closest('.ser').find('.mobile-service-modal').remove();
                    $(this).removeClass('ser-open');
                }
                else{
                    $(this).closest('.ser').append('<div class="mobile-service-modal">'+ service[no] +'</div>')
                    $(this).addClass('ser-open');
                }
            })                  

            return;

            } else {
                /* Not Mobile -------------*/

                /* Init FullPage*/  
                $('#fullpage').fullpage({
                    menu: '.menu-main',
                    anchors:['page-home', 'page-about','page-vision','page-services','page-clients','page-contact']
                }); 

                /* Service Modal For Desktop*/      
                    $('.mo').click(function() {

                        var id = $(this).data(id);
                        var no = id['id'];

                        if ($('#services-content').hasClass('scvisible')) {

                            $('#services-content .content').html(service[no]);

                        } else {
                            $('#services-content').toggleClass('scvisible')
                            $('#services-content .content').html(service[no]);
                        }

                    })

                    /* Hide service modal*/
                    $('#three .close i').click(function() {
                        $('#services-content').toggleClass('scvisible')
                    })

                    /* Hide Menu on click*/
                    $('a').on('click',function () {
                         $('.menu').removeClass('open')
                    })
            }

            

                
        }) 

