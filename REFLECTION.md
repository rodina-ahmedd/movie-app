# Reflection

## What was hardest

The Gemini API. I hit three different errors in a row and they looked
the same to me at first: a 404, then a 503, then a quota error. I kept
thinking my code was broken. It wasn't. The 404 meant the model I
picked had been retired. The 503 meant Google was overloaded. The quota
error meant I had used up the free tier. Three problems, three
different fixes. It took me a while to learn to read the actual error
message instead of guessing.

## What I would do differently

I would test the API with one plain request in the browser before
writing any code around it. That would have shown me the working model
name on the first day. I would also write the tests earlier. I only
checked coverage at the end, and my first number (87%) was misleading
because it only counted the files my tests touched.

## What surprised me

How much one small change can matter. Adding `<main>` and `<header>`
took WAVE from 11 alerts to 0. I also did not expect the error
messages to be so useful once I actually read them. The 404 told me
the exact model name to switch to.