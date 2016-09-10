![Hoopa](https://manaflair.github.io/hoopa/assets/logo-hoopa.png)

> A crawler made for programmers

## Installation

```
$> sudo apt-get install jq                # dependencies
$> npm install -g @manaflair/hoopa        # hoopa itself
```

## Usage

```
$> hoopa examples/allocine.hoopa
```

## Functions

*To be continued...*

## Advanced

### Concurrent execution

Probably the main selling point of Hoopa: without changing anything in your source code, simply by adding the `--parallel` flag, Hoopa will try to run concurrent portions of your code simultaneously as often as it can. It's extremely valuable when crawling multiple websites at once, since you won't lose time waiting for one's request and will instead be able to directly query the others, but it might also be quite useful when crawling a single website.

Be careful, tho: this feature is extremely powerful, but a great power comes with great responsibilities. Running too many concurrent requests might overload the target servers, and you might end up banned if not worse. Thankfully, you will be able to avoid most issues by reading the following.

### Network throttling

When running Hoopa with the `--parallel` flag, the crawler will send a lot of requests simultaneously, which may cause huge performance issues on targeted servers (and Hoopa won't help you if these servers decide to ban you). Depending on your country, running too many requests might even be illegal (because you would effectively be DOSing the target).

In order to alleviate this issue and be as gentle as possible with aforementioned servers, you can set rules inside a `.hooparc` file that will instruct Hoopa to limit itself when querying those servers. Here is an example of possible rules:

```yaml
networkManager:

    *:
        maxConcurrentRequests: 5
        minRquestInterval: 1000

    www.allocine.fr:
        maxConcurrentRequests: 3
        minRequestInterval: 3000
```

In the example above, Hoopa will not send more than 5 concurrent requests and will wait for at least one second between each request from a same "thread", except for requests targeting the `www.allocine.fr` domain name, which has its limits set to respectively 3 concurrent requests and a 3 seconds min interval.

### User-agent

Just like you can set rate limit properties, you can also easily set user agents:

```
networkManager:

    *:
        userAgent: "Hoopa Hoopa c'est lui, le Marsupilami"

    www.allocine.fr:
        userAgent: "My favorite movie might very well be Django Unchained"
```

### License (MIT)

> **Copyright © 2016 Manaflair**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
