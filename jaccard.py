# -*- coding: utf-8 -*-
"""
@author: usmanmahmood
"""
from math import*
import csv
import mylibrary  
import sys
from mylibrary import read_csv_into_lists,find_similar_movies
# Read records from csv into list 50k Thousand Records
records_from_csv = read_csv_into_lists('movies.csv')
# Movie bought by target User
movie_visited_by_user  = [str(sys.argv[1])]
# Function to find similar movies recommended for User
finalMoviesToRecommend = find_similar_movies(movie_visited_by_user,records_from_csv)
no_of_movies_to_recommend = 5
# Display the results
print str(finalMoviesToRecommend[:no_of_movies_to_recommend])