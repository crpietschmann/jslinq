//-----------------------------------------------------------------------
// Part of the LINQ to JavaScript (JSLINQ) v2.x Project - https://github.com/crpietschmann/jslinq
// Copyright (C) 2012-2023 Chris Pietschmann (http://pietschsoft.com)
// This license can be found here: https://github.com/crpietschmann/jslinq/blob/master/LICENSE
//-----------------------------------------------------------------------

LINQ To JavaScript Project - https://github.com/crpietschmann/jslinq

To Run the Interactive SDK:
- Open up the Default.htm file in a web browser

To include JSLINQ within a website:
- 1) Copy the JSLINQ.js file into your website
- 2) Place the following script tag in the Head of your web page: <script type="text/javascript" src="JS/JSLINQ.js"></script>



JSLINQ Change Log
-----------------
Version 2.3 (11/17/2023)
-------------
- Cleaned up Javascript code to be a little more clean as per modern javascript standards
- Updated License and other links to point to Github project
- Add `forEach(callback)` function to JSLINQ object

Version 2.2
-------------
- Added lower case "jslinq" option that can be used interchangably with "JSLINQ"

- Added lower case options for the operator methods (ex: .where = .Where, .select = .Select, .orderBy = .OrderBy) that can be used interchangably with the upper case options.

- added a couple more fixes recommended by jslint, plus made TestSamples.htm run test automatically on page load

- Fixed js code, ala http://www.jslint.com

- Add ".Random(count)" method to return a random set of elements

- modified "new Array()" calls to "[]", and "new Object()" to "{}" to make the code cleaner

- Added ".Each" method

- Modified ".Select" to accept multiple fields to select by passing them in as a delimited string.

- Added "Skip" method to Bypasses a specified number of elements in a sequence and then returns the remaining elements.

- Added "Take" method to return the first 'n' number of elements in the array.

- Modify "OrderBy" and "OrderByDescending" to access "C#-like Lambda" expressions also.
    var sample = JSLINQ(Samples.People)
        .OrderBy("item => item.FirstName");

- Modify "Select" to accept fields/properties to select by passing in a string.
    var sample = JSLINQ(Samples.People)
        .Select("FirstName");
    OR
    var sample = JSLINQ(Samples.People)
        .Select("ID,FirstName,LastName");
    
- Modify "OrderByDescending" to accept the field/property to order by as a string in addition to accepting a "clause function"/lambda expression.
    var sample = JSLINQ(Samples.People)
        .OrderByDescending("FirstName");
            
- Modify "OrderBy" to accept the field/property to order by as a string in addition to accepting a "clause function"/lambda expression.
    var sample = JSLINQ(Samples.People)
        .OrderBy("FirstName");

- Select method fix: Stop calling "clause" twice for each iteration of an element. This improves performance of calling "Select".
- Modify all "clauses" / lambda expressions to get called having "this" equal to the Array Item where appropriate.
    var exampleArray = JSLINQ(myList)
        .Where(function(){ return this.FirstName == "Chris"; })
        .OrderBy(function() { return this.FirstName; })
        .Select(function(){ return this.FirstName; }); 

- Replace all "new JSLINQ()" usage with "JSLINQ()" in JSLINQ.js file. Helps make file smaller and utilizes the new method of calling JSLINQ.
- Replaced "index" variable name with "i" for iterator loops in JSLINQ.js. Just to make the file a little bit smaller.


Version 2.10 (4/20/2015)
-------------
- Modified the JSLINQ object to allow you to create an instance of JSLINQ containing an Array of elements
using either of the following methods:
    var option1 = JSLINQ(myArray);
    var option2 = new JSLINQ(myArray);

- Added an extensibility example; located at "/Examples/Extensions/get.htm"
- Added Improved Intellisense Support and moved it to the "JSLINQ-vsdoc.js" file.


Version 2.00
-------------
- Removed use of "eval" method
- Added an example of search an HTML DOM Table using JSLINQ
- Placed all functionality within the global JSLINQ object. This is to improve possible compatibility with other
javascript frameworks (like jQuery and ASP.NET AJAX).


Version 1.03
------------
- Added Intersect Operator
- Added DefaultIfEmpty Operator
- Added ElementAtOrDefault Operator
- Added FirstOrDefault Operator
- Added LastOrDefault Operator
- Started adding Usage Examples
-- Count Word Occurrences
-- Count Set of Words

Version 1.02
------------
- A few Bug fixes that were revealed with Unit Tests
- Interactive SDK Created
- Unit Test Created
--- Intial testing of the Samples Unit Tests yielded the following speed results for all tests:
------ IE7: ~10 milliseconds
------ FireFox 2: ~10 milliseconds
------ Safari 3 for Windows: ~4 milliseconds

Version 1.01
------------
- Added the OrderByDescending Operator
- Added the SelectMany Operator
- Added the Count Operator
- Added the Distinct Operator
- Added the Any Operator
- Added the All Operator
- Made it so you can access the elements "index" within the clause/predicate of each of the following Operators: Where, Count, Any, All
- Added the Reverse Operator, this also allows access to the elements "index" within the clause/predicate
- Added First Operator, this also allows access to the elements "index" within the clause/predicate
- Added Last Operator, this also allows access to the elements "index" within the clause/predicate
- Added ElementAt Operator
- Added Concat Operator - this is identical to JavaScripts Array.concat method

Version 1.00
------------
Operators
- From
- Where
- OrderBy
- Select