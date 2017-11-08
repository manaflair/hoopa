# [![Hoopa](/logo.png?raw=true)](https://github.com/manaflair/hoopa)

> A crawler made by programmers, for programmers.

[![](https://img.shields.io/npm/v/@manaflair/hoopa.svg)]() [![](https://img.shields.io/npm/l/@manaflair/hoopa.svg)]()

[Check out our other OSS projects!](https://manaflair.github.io)

## Installation

```
$> sudo apt-get install jq                # dependencies
$> npm install -g @manaflair/hoopa        # hoopa itself
```

## Usage

```
$> hoopa examples/allocine.hoopa
```

## Syntax

Hoopa has nothing to do with regular Javascript. It uses its own syntax, which hopefully shouldn't be too difficult to learn. The first thing to know is that, by many aspects, the language Hoopa uses is very similar to shell scripts. A Hoopa script is basically a sequence of instructions, some of them with options, that are executed sequentially.

The second thing to know, even more important, is that Hoopa is a stack-based language. Every instruction pops things from the stack and push its results on it. It might be a bit hard to reason about, but it's one of the most important feature of Hoopa: this stack architecture allows us to run concurrent "threads", without risking race conditions or other problems that parallel programming might encounter.

So, with this is mind, here is what a Hoopa script looks like:

```
push 0
push 5
math.range

array.each [
  print
]
```

Let's take this code line by line. We first start with an empty stack. On this stack we push two values: `0` and `5`, then we use the `math.range` instruction in order to pop those two values and generate a range that goes from `0` to `5` (so in the end, our stack will contain a single value, an array with `[0, 1, 2, 3, 4]`). Finally, we iterate over this array and print every element in it.

We could have avoided pushing values on the stack by using options:

```
math.range
  --from 0
  --to 5

array.each [
  print
]
```

That's the basic of the language, but frankly there's not much more to know. One thing you might notice is the strange brackets arround the `console.log` instruction - the code between those brackets is called an "instruction set", and is basically what you would call a block in every other language. Some instructions take instruction sets as parameters, some don't. Usually, instruction sets are only used by flow control instructions (`if`, array iteration, etc).

## Standard library

*To be continued...*

## Complex example

```
```

## Advanced

### Concurrent execution

Without changing one bit in your source code, you can instruct Hoopa to parallelize your code by adding the `--parallel` flag. With this flag set, Hoopa will try to run concurrent portions of your code all at once, as often as it can. You will find this feature extremely valuable when crawling multiple websites at once, since your script won't lose time waiting for a server's request before firing the next ones, but it might also be quite useful when crawling a single website.

Be careful, tho: this feature is extremely powerful, but a great power comes with great responsibilities. Running too many concurrent requests on a single server might overload it, and if such a thing happened, it's quite possible that you might end up banned if not worse. Thankfully, you will be able to avoid most issues by reading the next section of this documentation.

### Network throttling

Running Hoopa with the `--parallel` flag means that the crawler will send a lot of requests simultaneously. It will probably improve performances, but it might also cause huge performance issues on targeted servers, which might have to eventually ban your IP address. In order to prevent this from happening, Hoopa allows you to set some rules inside a `.hooparc` file, that will be used in order to instruct Hoopa to limit itself when querying remote servers. For example:

```yaml
networkManager:

    all:
        maxConcurrentRequests: 5
        minRequestInterval: 1000

    www.allocine.fr:
        maxConcurrentRequests: 3
        minRequestInterval: 3000
```

In the example above, Hoopa will not send more than 5 concurrent requests and will wait for at least one second between each request from a same "thread", except for requests targeting the `www.allocine.fr` server, which has its limits decreased to respectively 3 concurrent requests and a 3 seconds min interval.

### User-agent

Just like you can rate limit the crawler, you can also easily set its user agents:

```yaml
networkManager:

    all:
        userAgent: "Hoopa Hoopa c'est lui, le Marsupilami"

    www.allocine.fr:
        userAgent: "One of my favorite movies is Django Unchained"
```

### License (MIT)

> **Copyright © 2016 Manaflair**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
