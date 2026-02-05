# LINQ to JavaScript

LINQ to JavaScript (`JSLINQ`) is LINQ to Objects for JavaScript arrays, and adds power and flexibility of LINQ style queries to traditional JavaScript code.

## What is LINQ to JavaScript?

LINQ to JavaScript (JSLINQ for short) is an implementation of LINQ to Objects implemented in JavaScript. It is built using a set of extension methods built on top of the JavaScript Array object. If you are using Arrays then you can use JSLINQ; it's that simple!

## jDelivr CDN

Latest version:

```html
<script src="https://cdn.jsdelivr.net/gh/crpietschmann/jslinq/dist/JSLINQ.js"></script>
```

JavaScript include for v2.30:

```html
<script src="https://cdn.jsdelivr.net/gh/crpietschmann/jslinq@2.30/dist/JSLINQ.js"></script>
```


## Nuget Package

[http://nuget.org/packages/jslinq](http://nuget.org/packages/jslinq)

![](images/Nuget-jslinq-install.png)

## Example Usage

If you don't know what LINQ it's a feature set in the .NET development framework that allows more SQL-like querying of any kind of data. In the case of `JSLINQ` / LINQ to JavaScript, it provides the ability to query against Arrays.

    var myList = [
        {FirstName:"Chris",LastName:"Pearson"},
        {FirstName:"Kate",LastName:"Johnson"},
        {FirstName:"Josh",LastName:"Sutherland"},
        {FirstName:"John",LastName:"Ronald"},
        {FirstName:"Steve",LastName:"Pinkerton"}
    ];
            
    var exampleArray = JSLINQ(myList)
       .Where((item) => item.FirstName == "Chris")
       .OrderBy((item) => item.FirstName)
       .Select((item) => item.FirstName);

## Using LINQ to JavaScript

We will use this Array for the following examples:

    var myList = [
        {FirstName:"Chris",LastName:"Pearson"},
        {FirstName:"Kate",LastName:"Johnson"},
        {FirstName:"Josh",LastName:"Sutherland"},
        {FirstName:"John",LastName:"Ronald"},
        {FirstName:"Steve",LastName:"Pinkerton"}
    ];

**Create an Instance of the JSLINQ object with your data**

You need to create a new JSLINQ object and pass it the javascript array of data that you will be querying.

    var example = JSLINQ(myList);

**Using the Where operator to specify query criteria**

In this case, we're getting all items in the Array that have FirstName property set to Chris.

    var whereExample1 = JSLINQ(myList).
          Where(function(item){ return item.FirstName == "Chris"; });

**Using the Select operator to specify which data to return**

In this case, we're going to return only the FirstName property of each item in the Array.

    var selectTest2 = JSLINQ(myList).
        Select(function(item){ return item.FirstName; });

**Using the OrderBy operator to determine how to sort the order of the items in the Array**

In this case, we're going to order them by the FirstName property.

    var sortTest1 = JSLINQ(myList)
         .OrderBy(function(item){ return item.FirstName; });

## Related Links

[JSLinq Editor](http://secretgeek.net/JsLinq/)

2010/03/16: [LINQ for JavaScript: Using and Extending JSLINQ](http://www.gregshackles.com/2010/03/linq-for-javascript-using-and-extending-jslinq/)

2008/01/24: [LINQ to JavaScript (JSLINQ) Open Source Project Launched!](http://pietschsoft.com/post/2008/01/24/LINQ-to-JavaScript-%28JSLINQ%29-Open-Source-Project-Launched!.aspx)
