# paintbuddy.cc
A Simple Touch-screen Paint Webapp. This is intended to be a responsive, multi-platform, easy to use paint web application that has enough flexibility to create a variety of paintings while being easy enough for a child to use without tremendous frustration. It is response and multi-platform in the fact that it is intended to be run from any modern web browser on any device, touch-screen or not, and work the same on all. From the browser, this app is best run in full screen mode.

# Requirements 
- Node v10.9.0 or higher
- Vue 2.9.6 or higher

# Installation
OK, so just so you know, I wrote this app every night for a while as a side gig. That being said, you may look at these installation steps and think, *Does this guy know what he's doing? Why does he do it that way?* I do it "that way" because it happens to work and I only had so much time to learn the correct ways of doing things. Feel free to correct it! That being said, to install, follow these directions:

## Dev or Prod
1. Clone/Download the source code to this app
    - Place it somewhere *other* than where you want your source code to end up
2. Navigate to the place where you *do* want your source code to end up
3. Initialize the Vue Webpack project. Run the command

    `vue init webpack paintbuddy.cc`

4. Navigate into the `paintbuddy.cc` directory
5. Copy and overwrite (rsync) all of the downloaded source from the other directory to this current directory
6. Run

    `npm install`

## Dev
7. To get the project up and running, run

    `npm run dev`

## Prod
7. To create the build to be used in production, run

    `npm build`

8. All build content will appear in the `dist` directory within the current directory. Copy the `dist` folder to a place where it can be hosted by an active web server

