<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="browser-tree">
	<xsl:for-each select="./*">
		<!-- <xsl:sort order="ascending" select="@i"/>
		<xsl:sort order="ascending" select="@name"/> -->
		<div class="leaf">
			<xsl:if test="@_id">
				<xsl:attribute name="data-id"><xsl:value-of select="@_id"/></xsl:attribute>
			</xsl:if>
			<i class="icon-folder">
				<xsl:if test="@i">
					<xsl:attribute name="class">icon-audio</xsl:attribute>
				</xsl:if>
			</i>
			<span><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="file-tracks">
	<xsl:for-each select="./Tracks/Track">
		<xsl:call-template name="session-track" />
	</xsl:for-each>
</xsl:template>


<xsl:template name="session-track">
	<div class="track">
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:if test="@color">
			<xsl:attribute name="style">--c: <xsl:value-of select="@color"/>;</xsl:attribute>
		</xsl:if>
		<div class="title"><xsl:value-of select="@name"/></div>
		<div class="slots">
			<xsl:for-each select="./Clip">
				<b>
					<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="style">--r: <xsl:value-of select="@row"/>;</xsl:attribute>
					<xsl:value-of select="@name"/>
				</b>
			</xsl:for-each>
		</div>
		<div class="status">
			<i class="btn-stop"></i>
			<i class="pie-playing on1" style="--duration: 2s;"></i>
		</div>
		<div class="io"></div>
		<div class="sends" data-name="Sends">
			<xsl:for-each select="./Sends">
				<div class="knob">
					<xsl:attribute name="data-label"><xsl:value-of select="@label"/></xsl:attribute>
					<xsl:attribute name="data-value"><xsl:value-of select="@value"/></xsl:attribute>
				</div>
			</xsl:for-each>
		</div>
		<div class="mixer">
			<div>
				<div class="pan-knob" data-value="0"><div></div></div>
				<div class="track-btn activator"></div>
				<div class="track-btn solo">S</div>
				<div class="track-btn record">&#9679;</div>
			</div>
			<div class="volume">
				<xsl:attribute name="style">--vol: <xsl:value-of select="Volume/@value"/>%;</xsl:attribute>
				<div></div>
				<canvas width="6" height="111"></canvas>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="midi-notes">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--t: <xsl:value-of select="@t"/>;
				--l: <xsl:value-of select="@l"/>;
				--d: <xsl:value-of select="@d"/>;
			</xsl:attribute>
			<xsl:value-of select="@key"/>
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="midi-note-volume">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--l: <xsl:value-of select="@l"/>;
				--v: <xsl:value-of select="@v"/>;
			</xsl:attribute>
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="clip-pads">
	<xsl:choose>
		<xsl:when test="../Pads">
		<ol>
			<xsl:for-each select="../Pads/Pad">
				<li><xsl:value-of select="@name"/></li>
			</xsl:for-each>
		</ol>
		</xsl:when>
		<xsl:otherwise>
			<ul>
				<li>C7</li>
				<li>C6</li>
				<li>C5</li>
				<li>C4</li>
				<li>C3</li>
				<li>C2</li>
				<li>C1</li>
				<li>C0</li>
				<li>C-1</li>
				<li>C-2</li>
			</ul>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>


<xsl:template name="drumkit-pads">
	<ul class="pad-list disable-mute1">
	<xsl:for-each select="./s">
		<xsl:call-template name="drum-pad" />
	</xsl:for-each>
	</ul>
</xsl:template>


<xsl:template name="drum-pad">
	<li>
		<span class="pad-name"><xsl:value-of select="@name"/></span>
		<i class="pad-mute">M</i>
		<i class="pad-play" data-click="play-pad" data-arg="1">
			<xsl:attribute name="data-arg"><xsl:value-of select="@n"/></xsl:attribute>
		</i>
		<i class="pad-solo">S</i>
	</li>
</xsl:template>


</xsl:stylesheet>
