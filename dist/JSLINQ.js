//-----------------------------------------------------------------------
// LINQ to JavaScript (JSLINQ) Project - https://github.com/crpietschmann/jslinq
// Copyright (c) 2012-2023 Chris Pietschmann (http://pietschsoft.com)
// This license can be found here: https://github.com/crpietschmann/jslinq/blob/master/LICENSE
//-----------------------------------------------------------------------
(function () {
    var JSLINQ = window.jslinq = window.JSLINQ = function (dataItems) {
        return new JSLINQ.fn.init(dataItems);
    },
    utils = {
        processLambda: function (clause) {
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
        jslinq: '2.30',

        toArray: function () { return this.items; },
        forEach: function (callback) {
            this.items.forEach(callback);
            return this;
        },
        where: function (clause) {
            var newArray = [];
            // The clause was passed in as a Method that return a Boolean
            this.forEach((item, i) => {
                if (clause.apply(item, [item, i])) newArray[newArray.length] = item;
            });
            return JSLINQ(newArray);
        },
        select: function (clause) {
            var newArray = [], field = clause;
            if (typeof (clause) !== "function") {
                if (clause.indexOf(",") === -1) {
                    clause = function () { return this[field]; };
                } else {
                    clause = function () {
                        var obj = {};
                        field.split(',').forEach((f) => {
                            obj[f] = this[f];
                        });
                        return obj;
                    };
                }
            }

            // The clause was passed in as a Method that returns a Value
            this.forEach((item, i) => {
                val = clause.apply(item, [item]);
                if (val) newArray[newArray.length] = val;
            });
            return JSLINQ(newArray);
        },
        orderBy: function (clause) {
            var tempArray = [];
            this.forEach((item) => {
                tempArray.push(item);
            });

            if (typeof (clause) !== "function") {
                var field = clause;
                if (utils.isLambda(field)) {
                    clause = utils.processLambda(field);
                } else {
                    clause = function () { return this[field]; };
                }
            }

            return JSLINQ(tempArray.sort(function (a, b) {
                var x = clause.apply(a, [a]), y = clause.apply(b, [b]);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            })
        );
        },
        orderByDescending: function (clause) {
            var tempArray = [], field;
            this.forEach((item) => {
                tempArray.push(item);
            });

            if (typeof (clause) !== "function") {
                field = clause;
                if (utils.isLambda(field)) {
                    clause = utils.processLambda(field);
                } else {
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
            this.forEach((item) => {
                r = r.concat(clause.apply(item, [item]));
            });
            return JSLINQ(r);
        },
        count: function (clause) {
            if (clause === undefined) {
                return this.items.length;
            }
            return this.Where(clause).items.length;
        },
        distinct: function (clause) {
            var dict = {}, retVal = [];
            this.forEach((item) => {
                var val = clause.apply(item, [item]);
                // TODO - This doesn't correctly compare Objects. Need to fix this
                if (dict[val] === undefined) {
                    dict[val] = true;
                    retVal.push(val);
                }
            });
            dict = null;
            return JSLINQ(retVal);
        },
        any: function (clause) {
            var item;
            for (var i = 0; i < this.items.length; i++) {
                item = this.items[i];
                if (clause.apply(item, [item, i])) return true;
            }
            return false;
        },
        all: function (clause) {
            for (var i = 0; i < this.items.length; i++) {
                if (!clause(this.items[i], i)) return false;
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
            } else if (this.items.length > 0) {
                // If no clause was specified, then return the First element in the Array
                return this.items[0];
            }
            return null;
        },
        last: function (clause) {
            if (clause !== undefined) {
                return this.Where(clause).Last();
            } else {
                // If no clause was specified, then return the First element in the Array
                if (this.items.length > 0) {
                    return this.items[this.items.length - 1];
                }
            }
            return null;
        },
        elementAt: function (i) {
            return this.items[i];
        },
        concat: function (array) {
            var arr = array.items || array;
            return JSLINQ(this.items.concat(arr));
        },
        intersect: function (secondArray, clause) {
            var method, sa = (secondArray.items || secondArray), result = [];
            if (clause !== undefined) {
                method = clause;
            } else {
                method = (item, i1, item2, i2) => item === item2;
            }

            for (var a = 0; a < this.items.length; a++) {
                for (var b = 0; b < sa.length; b++) {
                    if (method(this.items[a], a, sa[b], b)) {
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
        fn.ForEach = fn.forEach;
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