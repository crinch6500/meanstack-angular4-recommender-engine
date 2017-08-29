def jaccard_similarity(x,y):  
 intersection_cardinality = len(set.intersection(*[set(x), set(y)]))
 union_cardinality = len(set.union(*[set(x), set(y)]))
 return intersection_cardinality/float(union_cardinality)


def euclidean_distance(x,y):
    from math import sqrt
    """ return euclidean distance between two lists """ 
    return sqrt(sum(pow(a-b,2) for a, b in zip(x, y))) 


def read_csv_into_lists(csv_file_name):
    import csv    
    i = 0
    result = []
    with open(csv_file_name, 'rU') as csvfile:
        rows = csv.reader(csvfile, delimiter=',')
        for row in rows:
            result.insert(i,row)
            i = i + 1
        return result

def find_similar_movies(movie_visited_by_user,records):
    resultsMatch = {}
    results = []    
    finalMoviesToRecommend = []
    for rec in records:
        j = 0
        #print rec
        js_value = jaccard_similarity(movie_visited_by_user,rec)
        results.insert(j,js_value) 
        resultsMatch[js_value] = rec
        if(js_value>0):
            finalMoviesToRecommend = finalMoviesToRecommend + resultsMatch[js_value]
        j = j + 1
    finalMoviesToRecommend = list(set(finalMoviesToRecommend) - set(movie_visited_by_user))        
    return finalMoviesToRecommend
