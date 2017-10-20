//-----------------------------------------------------------------------
// Part of the LINQ to JavaScript (JSLINQ) v2.20 Project - http://jslinq.codeplex.com
// Copyright (C) 2012 Chris Pietschmann (http://pietschsoft.com). All rights reserved.
// This license can be found here: http://jslinq.codeplex.com/license
//-----------------------------------------------------------------------
(function () {
    var JSLINQ = window.jslinq = window.JSLINQ = function (dataItems) {
        return new JSLINQ.fn.init(dataItems);
    },
    utils = {
        processLambda: function (clause) {
            // This piece of "handling" C#-style Lambda expression was borrowed from:
            // linq.js - LINQ for JavaScript Library - http://lingjs.codeplex.com
            // THANK!!
            if (utils.isLambda(clause)) {
                var expr = clause.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
                return new Function(expr[1], "return (" + expr[2] + ")");
            }
            return clause;
        },
        isLambda: function (clause) {
            return (clause.indexOf("=>") > -1);
        },
        randomIndex: function (max, existing) {
            var q, r, f = function () { return this == r; };
            if (!existing) {
                return parseInt(Math.random() * max, 10);
            } else {
                q = JSLINQ(existing);
                r = -1;
                while (r < 0 || q.Where(f).Count() !== 0) {
                    r = utils.randomIndex(max);
                }
                return r;
            }
        }
    };
    JSLINQ.fn = JSLINQ.prototype = {
        init: function (dataItems) {
            this.items = dataItems;
        },

        // The current version of JSLINQ being used
        jslinq: "2.20",

        toArray: function () { return this.items; },
        where: function (clause) {
            var newArray = [], len = this.items.length;

            // The clause was passed in as a Method that return a Boolean
            for (var i = 0; i < len; i++) {
                if (clause.apply(this.items[i], [this.items[i], i])) {
                    newArray[newArray.length] = this.items[i];
                }
            }
            return JSLINQ(newArray);
        },
        select: function (clause) {
            var item, newArray = [], field = clause;
            if (typeof (clause) !== "function") {
                if (clause.indexOf(",") === -1) {
                    clause = function () { return this[field]; };
                } else {
                    clause = function () {
                        var i, fields = field.split(","), obj = {};
                        for (i = 0; i < fields.length; i++) {
                            obj[fields[i]] = this[fields[i]];
                        }
                        return obj;
                    };
                }
            }

            // The clause was passed in as a Method that returns a Value
            for (var i = 0; i < this.items.length; i++) {
                item = clause.apply(this.items[i], [this.items[i]]);
                if (item) {
                    newArray[newArray.length] = item;
                }
            }
            return JSLINQ(newArray);
        },
        orderBy: function (clause) {
            var tempArray = [];
            for (var i = 0; i < this.items.length; i++) {
                tempArray[tempArray.length] = this.items[i];
            }

            if (typeof (clause) !== "function") {
                var field = clause;
                if (utils.isLambda(field)) {
                    clause = utils.processLambda(field);
                }
                else {
                    clause = function () { return this[field]; };
                }
            }

            return JSLINQ(
            tempArray.sort(function (a, b) {
                var x = clause.apply(a, [a]), y = clause.apply(b, [b]);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        );
        },
        orderByDescending: function (clause) {
            var tempArray = [], field;
            for (var i = 0; i < this.items.length; i++) {
                tempArray[tempArray.length] = this.items[i];
            }

            if (typeof (clause) !== "function") {
                field = clause;
                if (utils.isLambda(field)) {
                    clause = utils.processLambda(field);
                }
                else {
                    clause = function () { return this[field]; };
                }
            }

            return JSLINQ(tempArray.sort(function (a, b) {
                var x = clause.apply(b, [b]), y = clause.apply(a, [a]);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }));
        },
        selectMany: function (clause) {
            var r = [];
            for (var i = 0; i < this.items.length; i++) {
                r = r.concat(clause.apply(this.items[i], [this.items[i]]));
            }
            return JSLINQ(r);
        },
        count: function (clause) {
            if (clause === undefined) {
                return this.items.length;
            } else {
                return this.Where(clause).items.length;
            }
        },
        distinct: function (clause) {
            var item, dict = {}, retVal = [];
            for (var i = 0; i < this.items.length; i++) {
                item = clause.apply(this.items[i], [this.items[i]]);
                // TODO - This doesn't correctly compare Objects. Need to fix this
                if (dict[item] === undefined) {
                    dict[item] = true;
                    retVal.push(item);
                }
            }
            dict = null;
            return JSLINQ(retVal);
        },
        any: function (clause) {
            for (var i = 0; i < this.items.length; i++) {
                if (clause.apply(this.items[i], [this.items[i], i])) { return true; }
            }
            return false;
        },
        all: function (clause) {
            for (var i = 0; i < this.items.length; i++) {
                if (!clause(this.items[i], i)) { return false; }
            }
            return true;
        },
        reverse: function () {
            var retVal = [];
            for (var i = this.items.length - 1; i > -1; i--) {
                retVal[retVal.length] = this.items[i];
            }
            return JSLINQ(retVal);
        },
        first: function (clause) {
            if (clause !== undefined) {
                return this.Where(clause).First();
            }
            else {
                // If no clause was specified, then return the First element in the Array
                if (this.items.length > 0) {
                    return this.items[0];
                } else {
                    return null;
                }
            }
        },
        last: function (clause) {
            if (clause !== undefined) {
                return this.Where(clause).Last();
            }
            else {
                // If no clause was specified, then return the First element in the Array
                if (this.items.length > 0) {
                    return this.items[this.items.length - 1];
                } else {
                    return null;
                }
            }
        },
        elementAt: function (i) {
            return this.items[i];
        },
        concat: function (array) {
            var arr = array.items || array;
            return JSLINQ(this.items.concat(arr));
        },
        intersect: function (secondArray, clause) {
            var clauseMethod, sa = (secondArray.items || secondArray), result = [];
            if (clause !== undefined) {
                clauseMethod = clause;
            } else {
                clauseMethod = function (item, index, item2, index2) { return item === item2; };
            }

            for (var a = 0; a < this.items.length; a++) {
                for (var b = 0; b < sa.length; b++) {
                    if (clauseMethod(this.items[a], a, sa[b], b)) {
                        result[result.length] = this.items[a];
                    }
                }
            }
            return JSLINQ(result);
        },
        defaultIfEmpty: function (defaultValue) {
            if (this.items.length === 0) {
                return defaultValue;
            }
            return this;
        },
        elementAtOrDefault: function (i, defaultValue) {
            if (i >= 0 && i < this.items.length) {
                return this.items[i];
            }
            return defaultValue;
        },
        firstOrDefault: function (defaultValue) {
            return this.First() || defaultValue;
        },
        lastOrDefault: function (defaultValue) {
            return this.Last() || defaultValue;
        },
        take: function (count) {
            return this.Where(function (item, index) { return index < count; });
        },
        skip: function (count) {
            return this.Where(function (item, index) { return index >= count; });
        },
        each: function (clause) {
            var len = this.items.length;
            for (var i = 0; i < len; i++) {
                clause.apply(this.items[i], [this.items[i], i]);
            }
            return this;
        },
        random: function (count) {
            var len = this.Count(), rnd = [];
            if (!count) { count = 1; }
            for (var i = 0; i < count; i++) {
                rnd.push(utils.randomIndex(len - 1, rnd));
            }
            rnd = JSLINQ(rnd);
            return this.Where(function (item, index) {
                return rnd.Where(function () {
                    return this == index;
                }).Count() > 0;
            });
        }
    };

    (function (fn) {
        fn.ToArray = fn.toArray;
        fn.Where = fn.where;
        fn.Select = fn.select;
        fn.OrderBy = fn.orderBy;
        fn.OrderByDescending = fn.orderByDescending;
        fn.SelectMany = fn.selectMany;
        fn.Count = fn.count;
        fn.Distinct = fn.distinct;
        fn.Any = fn.any;
        fn.All = fn.all;
        fn.Reverse = fn.reverse;
        fn.First = fn.first;
        fn.Last = fn.last;
        fn.ElementAt = fn.elementAt;
        fn.Concat = fn.concat;
        fn.Intersect = fn.intersect;
        fn.DefaultIfEmpty = fn.defaultIfEmpty;
        fn.ElementAtOrDefault = fn.elementAtOrDefault;
        fn.FirstOrDefault = fn.firstOrDefault;
        fn.LastOrDefault = fn.lastOrDefault;
        fn.Take = fn.take;
        fn.Skip = fn.skip;
        fn.Each = fn.each;
        fn.Random = fn.random;
    })(JSLINQ.fn);

    JSLINQ.fn.init.prototype = JSLINQ.fn;
})();