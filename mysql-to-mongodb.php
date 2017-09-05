<?php
function getMyTables( $dbname ) {
 $tables = array();
 $sql = mysql_query("SHOW TABLES FROM $dbname ") or die("Error getting tables from $dbname");

 if( mysql_num_rows( $sql ) > 0 ) {
   while( $table = mysql_fetch_array( $sql ) ) {
     $explain = explainMyTable( $table[0] ); 
     $tables[$table[0]] = $explain;
    }
 }
 return $tables;
}

function explainMyTable( $tbname ) {
  $explain = array();
  $sql = mysql_query("EXPLAIN $tbname") or die("Error getting table structure");
  $i = 0;

  while( $get = mysql_fetch_array( $sql ) ) {
     array_push( $explain, $get[0] ); 
     $i++;
  }
  return $explain;
}

function checkEncode($string) {
  if( !mb_check_encoding($string,'UTF-8')) {
    return mb_convert_encoding($string,'UTF-8','ISO-8859-1');
  } else {
    return $string;
  }
}

$mydb   = "bigdata_movies";
$myconn = mysql_connect('localhost','root','password');
$setmydb   = mysql_select_db( $mydb );
$mytables = getMyTables( $mydb );

$modb   = "test";
echo 'one';
try {
	echo 'two';
  $moconn = new Mongo();
  echo 'three';
  $modb = $moconn->selectDB( $modb );
} catch(MongoConnectionException $e) {
  die("Problem during mongodb initialization. Please start mongodb server.");
}

foreach( $mytables as $table => $struct ) {
  $sql = mysql_query("SELECT * FROM $table LIMIT 0 , 500000") or die( mysql_error() );
  $count = mysql_num_rows( $sql );

  // Starts new collection on mongodb
  $collection = $modb->$table;

  // If it has content insert all content
  if( $count > 0 ) {
    while( $info = mysql_fetch_array( $sql, MYSQL_NUM )) {
      $infosize = count( $info );
      $mosql = array();

      for( $i=0; $i < $infosize; $i++ ) {
        $mosql[$struct[$i]] = checkEncode($info[$i]);
  }

  $collection->insert($mosql);
  }
// Only create a new entry empty
} else {
  for( $i=0; $i < $infosize; $i++ ) {
    $mosql[$struct[$i]] = '';
  }

  $collection->insert($mosql);
  }
}

echo "Done! Please, check your mongodb collection and have fun!";
?>
