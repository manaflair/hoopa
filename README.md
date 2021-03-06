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

```bash
push 0
push 5
math.range

array.each {
  console.dump
}
```

Let's take this code line by line. We first start with an empty stack. On this stack we push two values: `0` and `5`, then we use the `math.range` instruction in order to pop those two values and generate a range that goes from `0` to `5` (so in the end, our stack will contain a single value, an array with `[0, 1, 2, 3, 4]`). Finally, we iterate over this array and print every element in it.

We could have avoided pushing values on the stack by using options:

```bash
math.range --from=0 --to=5

array.each {
  console.dump
}
```

### Control flow & instruction sets

You might have noticed in the previous example the strange brackets arround the `console.log` instruction - the code between those brackets is called an "instruction set", and is basically what you would call a block in every other language. Some instructions take instruction sets as final parameters, some don't. Usually, instruction sets are only used by flow control instructions (`if`, array iteration, etc). Another example:

```
if {
  push 1
} {
  # if the condition is satisfied
} {
  # otherwise
}
```

### Variables

Variables are supported! They also use the stack - any value that ends up at the top of the stack in the subcontext will be stored inside the variable:

```
local myVar {
  push 42
}
```

Variables are inherited from a context to its child subcontexts, but child subcontexts cannot change their value (any redeclaration will shadow the variable):

```
local myVar {
  push 42
}

math.range --from=0 --to=5

array.map {
  push ${myVar}
}
```

Finally, a convenience syntax exists to allow you to directly access the stack, without needing to explicitely declare a variable:

```
push 42
push 24

console.log ${^0} # Will print the element at the top of the stack
console.log ${^1} # Will print the second element from the stack
```

Variable can be interpolated, in which case they'll be converted into strings:

```
push 42

console.log The magic number is ${^0}!
```

## Standard library

*To be continued...*

## Complex example

```bash
# This file will fetch every movie from the first five pages of Allocine,
# then extract those which have a grade of 3.5 or more, sort them, and
# print them.

math.range --from=1 --to=5

array.map {
  http.get http://www.allocine.fr/film/aucinema/?page=${^}
  html.select --type=element[] #content-layout .card

  array.map --silent-errors {
    concurrent {
      html.select --type=text .meta-title-link
      string.clean
      object.wrap --key=name
    } {
      html.select --type=text .rating-item:nth-child(2) .stareval-note
      number.parse --locale=fr-FR
      object.wrap --key=grade
    }

    object.assign
  }

  array.filter {
    json.select .grade
    number.gt --or-eq 3.5
  }
}

array.flatten

array.sortBy {
  json.select .grade
  number.neg
}

array.each {
  local movieName {
    json.select .name
  }
  local movieGrade {
    json.select .grade
  }
  console.log ${movieName} (${movieGrade})
}
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

### User-agent & other headers

Just like you can rate limit the crawler, you can also easily set its user agent strings:

```yaml
networkManager:

    all:
        headers:
            "User-Agent": "curl/7.9.8 (i686-pc-linux-gnu) libcurl 7.9.8 (OpenSSL 0.9.6b) (ipv6 enabled)"

    www.allocine.fr:
        headers:
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
```

### License (MIT)

> **Copyright © 2016 Manaflair**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
